import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TeacherList from './components/TeacherList';
import EmotionBoard from './components/EmotionBoard';
import SettingsModal from './components/SettingsModal';
import ShareModal from './components/ShareModal';
import RecentActivity from './components/RecentActivity';
import { Teacher, Emotion, SheetConfig, LogItem } from './types';
import { EMOTIONS } from './data/emotions';
import { initAuth, googleSignIn } from './lib/firebase';
import { appendEmotionRecord, sendToGasWebhook } from './lib/sheets';
import { User } from 'firebase/auth';
import { AlertCircle, FileSpreadsheet, Sparkles, RefreshCw } from 'lucide-react';
import {
  saveRosterToCloud,
  getSharedRosterFromCloud,
  subscribeRosterFromCloud,
  saveDailyStateToCloud,
  subscribeDailyBoardFromCloud,
  resetTeacherStateInCloud,
  resetDailyBoardInCloud,
  getUrlWithRoster,
  parseRosterFromUrl,
  DEFAULT_GAS_URL,
  saveGasUrlToCloud,
  getGasUrlFromCloud,
  subscribeGasUrlFromCloud
} from './lib/firestoreService';

const DEFAULT_TEACHERS = [
  '김연수', '박배움', '이열정', '최미소', '정행복', 
  '강성장', '윤지혜', '임소통', '한나눔', '송보람',
  '신창의', '유수업', '오나눔'
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>({
    spreadsheetId: null,
    spreadsheetUrl: null,
    sheetName: '감정기록'
  });

  // Auth States
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isAuthRestoring, setIsAuthRestoring] = useState(true);
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Settings, Share & GAS State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [gasUrl, setGasUrl] = useState<string>(DEFAULT_GAS_URL);

  // Sync Log states
  const [recentLogs, setRecentLogs] = useState<LogItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('');

  // 1. Initialize Date & Load local/cloud configurations
  useEffect(() => {
    // Default to today's date in YYYY-MM-DD
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setSelectedDate(formattedToday);

    // Load GAS Web App URL from local or cloud
    const storedGasUrl = localStorage.getItem('emotion_board_gas_url');
    if (storedGasUrl) {
      setGasUrl(storedGasUrl);
    }
    getGasUrlFromCloud().then((cloudUrl) => {
      if (cloudUrl) {
        setGasUrl(cloudUrl);
        localStorage.setItem('emotion_board_gas_url', cloudUrl);
      }
    });

    const unsubscribeGas = subscribeGasUrlFromCloud((cloudUrl) => {
      if (cloudUrl) {
        setGasUrl(cloudUrl);
        localStorage.setItem('emotion_board_gas_url', cloudUrl);
      }
    });

    // Check URL parameters for shared roster
    const urlRoster = parseRosterFromUrl();
    if (urlRoster && urlRoster.length > 0) {
      localStorage.setItem('emotion_board_teacher_names', JSON.stringify(urlRoster));
      saveRosterToCloud(urlRoster);
      setTeachers(urlRoster.map((name, index) => ({
        id: `teacher_${index}_${name}`,
        name
      })));
    } else {
      // First check localStorage for quick display
      const storedNamesStr = localStorage.getItem('emotion_board_teacher_names');
      if (storedNamesStr) {
        try {
          const storedNames = JSON.parse(storedNamesStr);
          if (Array.isArray(storedNames) && storedNames.length > 0) {
            setTeachers(storedNames.map((name: string, index: number) => ({
              id: `teacher_${index}_${name}`,
              name
            })));
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Fetch cloud roster immediately so new users/devices see the shared list
      getSharedRosterFromCloud().then((cloudNames) => {
        if (cloudNames && cloudNames.length > 0) {
          localStorage.setItem('emotion_board_teacher_names', JSON.stringify(cloudNames));
          setTeachers((prevTeachers) => {
            return cloudNames.map((name, index) => {
              const existing = prevTeachers.find((t) => t.name === name);
              return {
                id: `teacher_${index}_${name}`,
                name,
                currentEmotionId: existing?.currentEmotionId,
                customNote: existing?.customNote
              };
            });
          });
        } else {
          // If no cloud roster exists yet, upload default teachers to cloud so everyone gets synced
          const storedNamesStr = localStorage.getItem('emotion_board_teacher_names');
          const initialNames = storedNamesStr ? JSON.parse(storedNamesStr) : DEFAULT_TEACHERS;
          saveRosterToCloud(initialNames);
          setTeachers(initialNames.map((name: string, index: number) => ({
            id: `teacher_${index}_${name}`,
            name
          })));
        }
      });
    }

    // Load sheet configuration
    const storedSheet = localStorage.getItem('emotion_board_sheet_config');
    if (storedSheet) {
      try {
        setSheetConfig(JSON.parse(storedSheet));
      } catch (e) {
        console.error(e);
      }
    }

    // Initialize Firebase Auth Listener
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        setIsAuthRestoring(false);
        setIsSessionExpired(false);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        setIsAuthRestoring(false);
        if (localStorage.getItem('emotion_board_sheet_config')) {
          setIsSessionExpired(true);
        }
      }
    );

    // Subscribe to cloud master roster changes in real-time
    const unsubscribeRoster = subscribeRosterFromCloud((cloudNames) => {
      if (cloudNames && cloudNames.length > 0) {
        localStorage.setItem('emotion_board_teacher_names', JSON.stringify(cloudNames));
        setTeachers((prevTeachers) => {
          return cloudNames.map((name, index) => {
            const existing = prevTeachers.find((t) => t.name === name);
            return {
              id: `teacher_${index}_${name}`,
              name,
              currentEmotionId: existing?.currentEmotionId,
              customNote: existing?.customNote
            };
          });
        });
      }
    });

    return () => {
      unsubscribe();
      if (typeof unsubscribeRoster === 'function') unsubscribeRoster();
      if (typeof unsubscribeGas === 'function') unsubscribeGas();
    };
  }, []);

  // 2. Load teachers and subscribe to daily board changes when Date changes
  useEffect(() => {
    if (!selectedDate) return;

    // Load current emotions check-ins for this specific date
    const storedState = localStorage.getItem(`emotion_board_state_${selectedDate}`);
    let stateMap: Record<string, any> = {};
    if (storedState) {
      try {
        stateMap = JSON.parse(storedState);
      } catch (e) {
        console.error(e);
      }
    }

    setTeachers((prevTeachers) => {
      // Determine list of teacher names: use existing teachers in memory if present,
      // otherwise fallback to localStorage or default
      let namesToUse = prevTeachers.map((t) => t.name);
      if (namesToUse.length === 0) {
        const storedNamesStr = localStorage.getItem('emotion_board_teacher_names');
        if (storedNamesStr) {
          try {
            const parsed = JSON.parse(storedNamesStr);
            if (Array.isArray(parsed) && parsed.length > 0) {
              namesToUse = parsed;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      if (namesToUse.length === 0) {
        namesToUse = DEFAULT_TEACHERS;
      }

      return namesToUse.map((name: string, index: number) => {
        const item = stateMap[name];
        if (typeof item === 'string') {
          return {
            id: `teacher_${index}_${name}`,
            name,
            currentEmotionId: item,
            emotionIds: [item]
          };
        } else if (item && typeof item === 'object') {
          const emotionIds = item.emotionIds || (item.emotionId ? [item.emotionId] : []);
          return {
            id: `teacher_${index}_${name}`,
            name,
            currentEmotionId: item.emotionId || emotionIds[0],
            emotionIds: emotionIds,
            customNote: item.customNote
          };
        }
        return {
          id: `teacher_${index}_${name}`,
          name
        };
      });
    });

    setSelectedTeacherId(null);

    // Load local history feed for today
    const storedLogs = localStorage.getItem(`emotion_board_logs_${selectedDate}`);
    if (storedLogs) {
      try {
        setRecentLogs(JSON.parse(storedLogs));
      } catch (e) {
        setRecentLogs([]);
      }
    } else {
      setRecentLogs([]);
    }

    // Subscribe to real-time daily board updates from Firestore cloud
    const unsubscribeDaily = subscribeDailyBoardFromCloud(selectedDate, (cloudStateMap) => {
      setTeachers((prevTeachers) => {
        return prevTeachers.map((t) => {
          const cloudItem = cloudStateMap[t.name];
          if (cloudItem) {
            const cloudEmotionIds = cloudItem.emotionIds || (cloudItem.emotionId ? [cloudItem.emotionId] : []);
            return {
              ...t,
              currentEmotionId: cloudItem.emotionId !== undefined ? cloudItem.emotionId : cloudEmotionIds[0],
              emotionIds: cloudEmotionIds,
              customNote: cloudItem.customNote !== undefined ? cloudItem.customNote : t.customNote
            };
          }
          return t;
        });
      });
    });

    return () => {
      if (typeof unsubscribeDaily === 'function') unsubscribeDaily();
    };
  }, [selectedDate]);

  // 3. Save Teachers or Sheet settings to localStorage & Cloud
  const handleSaveTeachers = (newNames: string[]) => {
    localStorage.setItem('emotion_board_teacher_names', JSON.stringify(newNames));
    saveRosterToCloud(newNames); // Sync to Firestore!
    
    // Merge new names with current emotions on screen
    const updatedTeachers: Teacher[] = newNames.map((name, index) => {
      const existing = teachers.find(t => t.name === name);
      return {
        id: `teacher_${index}_${name}`,
        name,
        currentEmotionId: existing?.currentEmotionId,
        customNote: existing?.customNote
      };
    });

    setTeachers(updatedTeachers);
    
    // Update active check state
    const stateMap: Record<string, { emotionId?: string; customNote?: string }> = {};
    updatedTeachers.forEach(t => {
      if (t.currentEmotionId || t.customNote) {
        stateMap[t.name] = {
          emotionId: t.currentEmotionId,
          customNote: t.customNote
        };
      }
    });
    localStorage.setItem(`emotion_board_state_${selectedDate}`, JSON.stringify(stateMap));
  };

  const handleSaveSheetConfig = (newConfig: SheetConfig) => {
    setSheetConfig(newConfig);
    localStorage.setItem('emotion_board_sheet_config', JSON.stringify(newConfig));
    setIsSessionExpired(false);
  };

  const handleSaveGasUrl = (url: string) => {
    const clean = url.trim();
    setGasUrl(clean);
    localStorage.setItem('emotion_board_gas_url', clean);
    saveGasUrlToCloud(clean);
  };

  const handleAuthChange = (user: User | null, token: string | null) => {
    setGoogleUser(user);
    setGoogleToken(token);
    if (user && token) {
      setIsSessionExpired(false);
    }
  };

  const handleQuickReauth = async () => {
    try {
      setSyncStatus('syncing');
      setSyncMessage('Google 계정 연동 중...');
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setIsSessionExpired(false);
        setSyncStatus('success');
        setSyncMessage('구글 계정이 다시 성공적으로 연동되었습니다!');
        setTimeout(() => setSyncStatus('idle'), 3000);
      }
    } catch (err: any) {
      setSyncStatus('error');
      setSyncMessage(err.message || '로그인에 실패했습니다.');
    }
  };

  // 4. Update Emotion / Custom Note Event Handler
  const handleSelectEmotion = async (emotionInput?: string | string[], customNote?: string) => {
    if (!selectedTeacherId) return;

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    // Normalize emotionIds
    let emotionIds: string[];
    if (Array.isArray(emotionInput)) {
      emotionIds = emotionInput;
    } else if (typeof emotionInput === 'string' && emotionInput) {
      emotionIds = [emotionInput];
    } else {
      emotionIds = [];
    }

    const currentEmotionId = emotionIds.length > 0 ? emotionIds[0] : undefined;
    const selectedEmotions = emotionIds
      .map(id => EMOTIONS.find(e => e.id === id))
      .filter((e): e is Emotion => e !== undefined);

    // A. Update local teachers state
    const updatedTeachers = teachers.map(t => {
      if (t.id === selectedTeacherId) {
        return {
          ...t,
          currentEmotionId,
          emotionIds,
          customNote: customNote !== undefined ? customNote : t.customNote
        };
      }
      return t;
    });
    setTeachers(updatedTeachers);

    // B. Save today's map to localStorage & Firestore Cloud
    const stateMap: Record<string, { emotionId?: string; emotionIds?: string[]; customNote?: string }> = {};
    updatedTeachers.forEach(t => {
      const ids = t.emotionIds && t.emotionIds.length > 0 ? t.emotionIds : (t.currentEmotionId ? [t.currentEmotionId] : []);
      if (ids.length > 0 || t.customNote) {
        stateMap[t.name] = {
          emotionId: t.currentEmotionId,
          emotionIds: ids,
          customNote: t.customNote
        };
      }
    });
    localStorage.setItem(`emotion_board_state_${selectedDate}`, JSON.stringify(stateMap));

    // Save to Firestore cloud database in real-time
    saveDailyStateToCloud(selectedDate, teacher.name, {
      emotionId: currentEmotionId,
      emotionIds,
      customNote
    });

    // C. Add to live activity feed
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const emoji = selectedEmotions.length > 0
      ? selectedEmotions.map(e => e.emoji).join(' ')
      : (customNote ? '✍️' : '❌');
    const emotionTitle = selectedEmotions.length > 0
      ? selectedEmotions.map(e => e.title).join(', ')
      : (customNote ? '주관식 한마디 기록' : '선택 해제됨');

    const newLogItem: LogItem = {
      id: `log_${Date.now()}_${teacher.name}`,
      teacherName: teacher.name,
      emoji,
      emotionTitle,
      customNote: customNote || undefined,
      time: timeString
    };

    const updatedLogs = [...recentLogs, newLogItem];
    setRecentLogs(updatedLogs);
    localStorage.setItem(`emotion_board_logs_${selectedDate}`, JSON.stringify(updatedLogs));

    let description = selectedEmotions.map(e => `${e.title}(${e.description})`).join(' / ');
    if (customNote) {
      description = description ? `${description} (주관식: ${customNote})` : `주관식: ${customNote}`;
    } else if (selectedEmotions.length === 0) {
      description = '감정 선택이 해제(삭제) 되었습니다.';
    }

    // D. Sync to Google Sheets via GAS Web App (works for ALL participants on mobile/web without login!)
    if (gasUrl) {
      setSyncStatus('syncing');
      setSyncMessage(`${teacher.name} 선생님 감정 구글 시트(GAS) 기록 중...`);

      sendToGasWebhook(gasUrl, {
        date: selectedDate,
        time: timeString,
        teacherName: teacher.name,
        emoji,
        emotionTitle,
        emotionDescription: description
      }).then((success) => {
        if (success) {
          setSyncStatus('success');
          setSyncMessage(selectedEmotions.length > 0 || customNote ? `스프레드시트(GAS)에 실시간 기록 완료!` : `스프레드시트(GAS)에 감정 해제 기록 완료!`);
          setTimeout(() => setSyncStatus('idle'), 3000);
        }
      });
    }

    // E. Direct Google Sheets API append if logged in & spreadsheetId configured
    if (sheetConfig.spreadsheetId && googleToken) {
      appendEmotionRecord(googleToken, sheetConfig.spreadsheetId, {
        date: selectedDate,
        time: timeString,
        teacherName: teacher.name,
        emoji,
        emotionTitle,
        emotionDescription: description
      }).catch((err) => console.warn('Direct sheet append fallback error:', err));
    }
  };

  // Reset emotion & custom note for single teacher
  const handleResetEmotion = (teacherId: string) => {
    const targetTeacher = teachers.find(t => t.id === teacherId);
    const updatedTeachers = teachers.map(t => {
      if (t.id === teacherId) {
        return { ...t, currentEmotionId: undefined, emotionIds: [], customNote: undefined };
      }
      return t;
    });
    setTeachers(updatedTeachers);

    // Save map
    const stateMap: Record<string, { emotionId?: string; emotionIds?: string[]; customNote?: string }> = {};
    updatedTeachers.forEach(t => {
      const ids = t.emotionIds && t.emotionIds.length > 0 ? t.emotionIds : (t.currentEmotionId ? [t.currentEmotionId] : []);
      if (ids.length > 0 || t.customNote) {
        stateMap[t.name] = {
          emotionId: t.currentEmotionId,
          emotionIds: ids,
          customNote: t.customNote
        };
      }
    });
    localStorage.setItem(`emotion_board_state_${selectedDate}`, JSON.stringify(stateMap));

    if (targetTeacher) {
      resetTeacherStateInCloud(selectedDate, targetTeacher.name);

      const now = new Date();
      const timeString = now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const resetRecord = {
        date: selectedDate,
        time: timeString,
        teacherName: targetTeacher.name,
        emoji: '❌',
        emotionTitle: '선택 해제됨',
        emotionDescription: '선생님의 감정이 초기화(해제)되었습니다.'
      };

      if (gasUrl) {
        setSyncStatus('syncing');
        setSyncMessage(`${targetTeacher.name} 선생님 감정 해제 시트 기록 중...`);
        sendToGasWebhook(gasUrl, resetRecord).then((success) => {
          if (success) {
            setSyncStatus('success');
            setSyncMessage(`스프레드시트(GAS)에 해제 상태 기록 완료!`);
            setTimeout(() => setSyncStatus('idle'), 3000);
          }
        });
      }

      if (sheetConfig.spreadsheetId && googleToken) {
        appendEmotionRecord(googleToken, sheetConfig.spreadsheetId, resetRecord).catch(() => {});
      }
    }
  };

  // Reset all emotions & custom notes today
  const handleResetAll = () => {
    const updatedTeachers = teachers.map(t => ({ ...t, currentEmotionId: undefined, emotionIds: [], customNote: undefined }));
    setTeachers(updatedTeachers);
    localStorage.removeItem(`emotion_board_state_${selectedDate}`);
    localStorage.removeItem(`emotion_board_logs_${selectedDate}`);
    setRecentLogs([]);
    resetDailyBoardInCloud(selectedDate);

    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const resetAllRecord = {
      date: selectedDate,
      time: timeString,
      teacherName: '전체 교사',
      emoji: '🧹',
      emotionTitle: '전체 감정 초기화',
      emotionDescription: '오늘 전광판의 전체 교사 감정이 초기화(해제)되었습니다.'
    };

    if (gasUrl) {
      sendToGasWebhook(gasUrl, resetAllRecord);
    }
    if (sheetConfig.spreadsheetId && googleToken) {
      appendEmotionRecord(googleToken, sheetConfig.spreadsheetId, resetAllRecord).catch(() => {});
    }
  };

  const handleShareLink = () => {
    const currentNames = teachers.map(t => t.name);
    if (currentNames.length > 0) {
      localStorage.setItem('emotion_board_teacher_names', JSON.stringify(currentNames));
      saveRosterToCloud(currentNames);
    }
    const shareUrl = getUrlWithRoster(currentNames);
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSyncStatus('success');
      setSyncMessage('📋 교사 명단이 연동된 생성 공유 주소가 클립보드에 복사되었습니다!');
      setTimeout(() => setSyncStatus('idle'), 4000);
    }).catch(() => {});
    setIsShareModalOpen(true);
  };

  const handleGoHome = () => {
    setSelectedTeacherId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getFormattedDateWithDay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} (${weekDays[d.getDay()]})`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-natural-bg font-sans pb-12 text-natural-text">
      {/* Header Panel */}
      <Header
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        sheetConfig={sheetConfig}
        googleUser={googleUser}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onShareLink={handleShareLink}
        onGoHome={handleGoHome}
      />

      {/* Main Board Section */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        
        {/* Natural Tones Headline Banner */}
        <div className="bg-natural-light-sage p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 shadow-sm border border-natural-sage/20">
          <div className="text-left w-full sm:w-auto">
            <h3 className="text-xl font-serif italic text-natural-deep-green font-bold">"오늘 연수는 어떠신가요?"</h3>
            <p className="text-sm text-natural-olive mt-1">자신의 이름을 선택하고 기분을 누르면 연수 현황판에 즉시 반영됩니다.</p>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto shrink-0">
            <p className="text-xs text-natural-sage font-mono font-bold">{getFormattedDateWithDay(selectedDate)}</p>
            <p className="text-lg font-bold text-natural-deep-green">교사용 실시간 감정 전광판</p>
          </div>
        </div>
        
        {/* Sync Toast / Notification Bar */}
        {syncStatus !== 'idle' && (
          <div
            id="sync_status_toast"
            className={`mb-4 p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all shadow-sm animate-fade-in ${
              syncStatus === 'syncing'
                ? 'bg-natural-soft-bg text-natural-olive border-natural-border'
                : syncStatus === 'success'
                ? 'bg-natural-light-sage/40 text-natural-deep-green border-natural-sage/20'
                : 'bg-rose-50 text-rose-800 border-rose-100'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncStatus === 'syncing' && <RefreshCw size={14} className="animate-spin text-natural-sage" />}
              {syncStatus === 'success' && <span className="text-sm">✨</span>}
              {syncStatus === 'error' && <AlertCircle size={14} className="text-rose-500" />}
              <span>{syncMessage}</span>
            </div>
            {syncStatus === 'error' && isSessionExpired && (
              <button
                id="toast_reauth_btn"
                onClick={handleQuickReauth}
                className="px-2.5 py-1 bg-natural-sand hover:bg-natural-sand/90 text-white rounded-md text-[10px] uppercase font-bold transition-all cursor-pointer"
              >
                재연동 로그인
              </button>
            )}
          </div>
        )}

        {/* Warning if Google login expired */}
        {isSessionExpired && syncStatus === 'idle' && (
          <div className="mb-4 p-4 rounded-xl border border-natural-border bg-natural-soft-bg text-natural-text flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2.5 text-left">
              <AlertCircle size={18} className="text-natural-sand shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-natural-olive">구글 스프레드시트 로그인이 해제되었습니다!</h4>
                <p className="text-[10px] text-natural-text/70 mt-0.5">
                  감정 체크 결과가 구글 시트에 안전하게 누가기록 되지 않을 수 있습니다. 1초 만에 다시 연동하세요.
                </p>
              </div>
            </div>
            <button
              id="warning_reauth_btn"
              onClick={handleQuickReauth}
              className="px-3.5 py-1.5 bg-natural-sand hover:bg-natural-sand/90 text-white font-bold rounded-lg text-xs transition-all shrink-0 cursor-pointer shadow-sm"
            >
              🔐 구글 계정 재인증
            </button>
          </div>
        )}

        {/* Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left panel: Teacher status list (Lg column: 4 of 12) */}
          <div className="lg:col-span-4 h-full flex flex-col gap-4 order-1">
            <TeacherList
              teachers={teachers}
              selectedTeacherId={selectedTeacherId}
              onSelectTeacher={setSelectedTeacherId}
              onResetEmotion={handleResetEmotion}
              onResetAll={handleResetAll}
            />
            
            <div className="hidden lg:block">
              <RecentActivity logs={recentLogs} />
            </div>
          </div>

          {/* Right panel: 30 Wit Emotion choices (Lg column: 8 of 12) */}
          <div className="lg:col-span-8 h-full order-2">
            <EmotionBoard
              selectedTeacherId={selectedTeacherId}
              teachers={teachers}
              onSelectEmotion={handleSelectEmotion}
            />
          </div>

          {/* Recent Activity for Mobile View (order-3) */}
          <div className="block lg:hidden order-3">
            <RecentActivity logs={recentLogs} />
          </div>

        </div>

      </main>

      {/* Settings Modal (Add/edit teachers & sheets linkage) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        teacherNames={teachers.map(t => t.name)}
        onSaveTeachers={handleSaveTeachers}
        sheetConfig={sheetConfig}
        onSaveSheetConfig={handleSaveSheetConfig}
        googleUser={googleUser}
        googleToken={googleToken}
        onAuthChange={handleAuthChange}
        gasUrl={gasUrl}
        onSaveGasUrl={handleSaveGasUrl}
        onResetAll={handleResetAll}
      />

      {/* Share Modal (Clean URL, TinyURL & QR code) */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        teacherNames={teachers.map(t => t.name)}
      />
    </div>
  );
}
