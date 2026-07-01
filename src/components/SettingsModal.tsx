import React, { useState, useEffect } from 'react';
import { X, Save, FileSpreadsheet, Plus, Trash2, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { extractSpreadsheetId, createNewSpreadsheet, validateSpreadsheetAccess } from '../lib/sheets';
import { googleSignIn, googleSignOut } from '../lib/firebase';
import { User } from 'firebase/auth';
import { SheetConfig } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherNames: string[];
  onSaveTeachers: (names: string[]) => void;
  sheetConfig: SheetConfig;
  onSaveSheetConfig: (config: SheetConfig) => void;
  googleUser: User | null;
  googleToken: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  teacherNames,
  onSaveTeachers,
  sheetConfig,
  onSaveSheetConfig,
  googleUser,
  googleToken,
  onAuthChange,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'teachers' | 'sheets'>('teachers');
  
  // Teacher management state
  const [namesText, setNamesText] = useState('');
  const [teachersCount, setTeachersCount] = useState(0);

  // Sheet configuration state
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [sheetError, setSheetError] = useState<string | null>(null);
  const [sheetSuccess, setSheetSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Populate textarea with current names separated by newline
    setNamesText(teacherNames.join('\n'));
    setTeachersCount(teacherNames.length);
  }, [teacherNames, isOpen]);

  useEffect(() => {
    if (sheetConfig.spreadsheetUrl) {
      setSheetUrlInput(sheetConfig.spreadsheetUrl);
    } else if (sheetConfig.spreadsheetId) {
      setSheetUrlInput(`https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/edit`);
    } else {
      setSheetUrlInput('');
    }
  }, [sheetConfig, isOpen]);

  if (!isOpen) return null;

  // Handle saving teacher names from textarea
  const handleSaveTeachers = () => {
    const rawLines = namesText.split('\n');
    const parsedNames = rawLines
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .slice(0, 30); // Max 30 teachers

    onSaveTeachers(parsedNames);
    setTeachersCount(parsedNames.length);
    setNamesText(parsedNames.join('\n'));
    
    // Show a temporary success style or close
    alert('교사 명단이 성공적으로 저장되었습니다! (최대 30명)');
  };

  // Preset template names
  const loadPresetNames = () => {
    const presets = [
      '김연수', '박배움', '이열정', '최미소', '정행복', 
      '강성장', '윤지혜', '임소통', '한나눔', '송보람',
      '신창의', '유수업', '오나눔', '서협력', '조다정'
    ];
    setNamesText(presets.join('\n'));
    setTeachersCount(presets.length);
  };

  // Google Login inside settings
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        onAuthChange(result.user, result.accessToken);
        setSheetError(null);
      }
    } catch (err: any) {
      setSheetError(err.message || 'Google 로그인에 실패했습니다.');
    }
  };

  // Google SignOut inside settings
  const handleGoogleSignOut = async () => {
    try {
      await googleSignOut();
      onAuthChange(null, null);
      setSheetError(null);
      setSheetSuccess(null);
    } catch (err: any) {
      setSheetError('로그아웃에 실패했습니다.');
    }
  };

  // Create a new Google Sheet automatically
  const handleCreateAutoSheet = async () => {
    if (!googleToken) {
      setSheetError('구글 로그인이 필요합니다.');
      return;
    }

    setIsCreatingSheet(true);
    setSheetError(null);
    setSheetSuccess(null);

    try {
      const today = new Date().toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').trim().replace(/ /g, '-');
      
      const sheetTitle = `교사 연수 감정 기록판 (${today})`;
      const result = await createNewSpreadsheet(googleToken, sheetTitle);
      
      const newConfig: SheetConfig = {
        spreadsheetId: result.spreadsheetId,
        spreadsheetUrl: result.spreadsheetUrl,
        sheetName: '감정기록',
      };
      
      onSaveSheetConfig(newConfig);
      setSheetUrlInput(result.spreadsheetUrl);
      setSheetSuccess('새 구글 스프레드시트가 드라이브에 생성되고 연동되었습니다!');
    } catch (err: any) {
      console.error(err);
      setSheetError(err.message || '스프레드시트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Link existing Google Sheet
  const handleLinkExistingSheet = async () => {
    if (!googleToken) {
      setSheetError('구글 로그인이 필요합니다.');
      return;
    }

    if (!sheetUrlInput.trim()) {
      setSheetError('스프레드시트 URL 또는 ID를 입력해주세요.');
      return;
    }

    setIsValidating(true);
    setSheetError(null);
    setSheetSuccess(null);

    try {
      const spreadsheetId = extractSpreadsheetId(sheetUrlInput);
      const isAccessible = await validateSpreadsheetAccess(googleToken, spreadsheetId);

      if (!isAccessible) {
        throw new Error('시트에 접근할 수 없습니다. 링크가 정확한지, 혹은 계정에 편집 권한이 있는지 확인하세요.');
      }

      const newConfig: SheetConfig = {
        spreadsheetId,
        spreadsheetUrl: sheetUrlInput.includes('http') ? sheetUrlInput : `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
        sheetName: '감정기록',
      };

      onSaveSheetConfig(newConfig);
      setSheetSuccess('기존 구글 스프레드시트와 성공적으로 연동되었습니다!');
    } catch (err: any) {
      setSheetError(err.message || '시트 연동 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div id="settings_modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-natural-border overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-natural-soft-bg/50 border-b border-natural-border">
          <h2 className="text-lg font-bold text-natural-olive flex items-center gap-2">
            <span>⚙️</span> 연수 관리 설정창
          </h2>
          <button
            id="close_settings_btn"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-natural-border/50 text-natural-text/60 hover:text-natural-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-natural-border">
          <button
            id="tab_teachers_btn"
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'teachers'
                ? 'border-natural-sand text-natural-sand'
                : 'border-transparent text-natural-text/50 hover:text-natural-text'
            }`}
          >
            👥 교사 명단 설정 ({teachersCount}명)
          </button>
          <button
            id="tab_sheets_btn"
            onClick={() => setActiveTab('sheets')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-natural-sand text-natural-sand'
                : 'border-transparent text-natural-text/50 hover:text-natural-text'
            }`}
          >
            📊 구글 시트 누가기록 연동
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: Teachers list */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-natural-text">
                  연수 참여 교사 명단 (최대 30명)
                </label>
                <button
                  id="preset_names_btn"
                  onClick={loadPresetNames}
                  className="text-xs text-natural-sage hover:text-natural-deep-green font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  ✨ 샘플 명단 불러오기
                </button>
              </div>

              <p className="text-xs text-natural-text/60 leading-relaxed">
                한 줄에 한 명씩 이름을 작성해주세요. 최대 30명까지 입력할 수 있습니다. 
                예쁘게 정렬된 교사 명단을 바탕으로 감정을 체크할 수 있는 전광판이 생성됩니다.
              </p>

              <div className="relative">
                <textarea
                  id="teacher_names_textarea"
                  value={namesText}
                  onChange={(e) => {
                    setNamesText(e.target.value);
                    const lines = e.target.value.split('\n').filter(n => n.trim().length > 0);
                    setTeachersCount(lines.length);
                  }}
                  rows={10}
                  placeholder="예시:&#10;김연수&#10;박배움&#10;이열정"
                  className="w-full p-4 border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-sage font-sans text-sm leading-relaxed text-natural-text bg-natural-bg focus:bg-white transition-all"
                />
                <div className="absolute bottom-3 right-3 bg-natural-olive text-white text-[11px] font-mono px-2 py-1 rounded-md opacity-80">
                  {teachersCount} / 30명
                </div>
              </div>

              {teachersCount > 30 && (
                <div className="flex items-center gap-2 text-rose-600 text-xs bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>최대 30명까지만 적용됩니다. 현재 초과된 명단은 저장 시 잘립니다.</span>
                </div>
              )}

              <button
                id="save_teachers_btn"
                onClick={handleSaveTeachers}
                className="w-full py-3 bg-natural-sand hover:bg-natural-sand/95 active:bg-natural-sand text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-natural-sand/10 transition-all cursor-pointer"
              >
                <Save size={18} />
                명단 저장 및 적용하기
              </button>
            </div>
          )}

          {/* TAB 2: Google Sheets */}
          {activeTab === 'sheets' && (
            <div className="space-y-5">
              <label className="block text-sm font-bold text-natural-text">
                구글 스프레드시트 누가기록 연동
              </label>

              <p className="text-xs text-natural-text/60 leading-relaxed">
                연수 날짜별로 참여하는 교사들의 실시간 감정 상태(이모티콘, 감정명, 날짜, 시간)를 구글 스프레드시트에 자동으로 누적하여 기록(누가기록)해 나갈 수 있습니다.
              </p>

              {/* 1. Auth Status */}
              <div className="p-4 rounded-xl border border-natural-border bg-natural-bg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-natural-text/50 uppercase tracking-wider">
                    구글 연동 상태
                  </div>
                  {googleUser ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-natural-light-sage text-natural-deep-green">
                      <span className="w-1.5 h-1.5 rounded-full bg-natural-deep-green"></span>
                      연결됨
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-natural-soft-bg border border-natural-border text-natural-text/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-natural-text/40"></span>
                      미연동
                    </span>
                  )}
                </div>

                {googleUser ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {googleUser.photoURL ? (
                        <img
                          src={googleUser.photoURL}
                          alt="Google Avatar"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full border border-natural-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-natural-light-sage text-natural-deep-green flex items-center justify-center text-sm font-bold">
                          {googleUser.displayName?.[0] || 'T'}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="text-xs font-bold text-natural-text">
                          {googleUser.displayName || '선생님'}
                        </div>
                        <div className="text-[10px] text-natural-text/50">
                          {googleUser.email}
                        </div>
                      </div>
                    </div>
                    <button
                      id="google_logout_btn"
                      onClick={handleGoogleSignOut}
                      className="px-2.5 py-1.5 text-xs text-natural-text/70 hover:text-natural-text border border-natural-border rounded-lg hover:bg-white transition-colors cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs text-natural-text/60 mb-3">
                      구글 시트에 감정을 기록하려면 Google 계정 로그인이 필요합니다.
                    </p>
                    <button
                      id="google_login_btn"
                      onClick={handleGoogleLogin}
                      className="w-full py-2.5 bg-white border border-natural-border hover:bg-natural-soft-bg text-natural-text font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-sm"
                    >
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                        <path fill="none" d="M0 0h48v48H0z"></path>
                      </svg>
                      Google 계정으로 연동하기
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Sheet Link Options */}
              {googleUser && (
                <div className="space-y-4 pt-2">
                  <div className="flex gap-2">
                    <button
                      id="create_new_sheet_btn"
                      onClick={handleCreateAutoSheet}
                      disabled={isCreatingSheet}
                      className="flex-1 py-3 bg-natural-deep-green hover:bg-natural-deep-green/90 disabled:bg-natural-deep-green/30 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-natural-deep-green/10 transition-all text-xs cursor-pointer"
                    >
                      {isCreatingSheet ? (
                        <RefreshCw size={14} className="animate-spin" />
                      ) : (
                        <FileSpreadsheet size={14} />
                      )}
                      {isCreatingSheet ? '시트 생성 중...' : '새 구글 시트 자동 생성'}
                    </button>
                  </div>

                  <div className="relative flex items-center my-3 text-natural-border">
                    <div className="flex-1 border-t border-natural-border"></div>
                    <span className="px-3 text-[10px] font-bold tracking-wider text-natural-text/50 uppercase">또는 기존 시트 주소 연동</span>
                    <div className="flex-1 border-t border-natural-border"></div>
                  </div>

                  <div className="space-y-2">
                    <input
                      id="sheet_url_input"
                      type="text"
                      value={sheetUrlInput}
                      onChange={(e) => setSheetUrlInput(e.target.value)}
                      placeholder="구글 시트 URL 또는 스프레드시트 ID"
                      className="w-full px-3.5 py-2.5 border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-sage text-xs bg-natural-bg focus:bg-white"
                    />
                    <button
                      id="link_existing_sheet_btn"
                      onClick={handleLinkExistingSheet}
                      disabled={isValidating}
                      className="w-full py-2 bg-natural-olive hover:bg-natural-olive/90 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:bg-natural-border"
                    >
                      {isValidating ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : null}
                      {isValidating ? '연결 확인 중...' : '입력한 스프레드시트 연결'}
                    </button>
                  </div>
                </div>
              )}

              {/* Connected Sheet Status card */}
              {sheetConfig.spreadsheetId && (
                <div className="p-4 rounded-xl border border-natural-sage/30 bg-natural-light-sage/40 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-natural-deep-green">
                        연동된 구글 스프레드시트 정보
                      </h4>
                      <p className="text-[10px] text-natural-deep-green/80 mt-1 font-mono break-all">
                        ID: {sheetConfig.spreadsheetId}
                      </p>
                      <p className="text-[10px] text-natural-text/60 mt-1">
                        기록용 워크시트명: <span className="font-semibold text-natural-olive">'{sheetConfig.sheetName}'</span>
                      </p>
                    </div>
                    {sheetConfig.spreadsheetUrl && (
                      <a
                        id="open_sheet_link"
                        href={sheetConfig.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md bg-white hover:bg-natural-soft-bg text-natural-deep-green hover:text-natural-deep-green border border-natural-border shadow-sm transition-all"
                        title="스프레드시트 열기"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Status messages */}
              {sheetError && (
                <div className="flex items-start gap-2 text-rose-600 text-xs bg-rose-50 p-3 rounded-xl border border-rose-100">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{sheetError}</span>
                </div>
              )}

              {sheetSuccess && (
                <div className="flex items-start gap-2 text-natural-deep-green text-xs bg-natural-light-sage/30 p-3 rounded-xl border border-natural-sage/30 animate-pulse">
                  <span>✅ {sheetSuccess}</span>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-natural-soft-bg/50 border-t border-natural-border flex justify-end">
          <button
            id="close_settings_footer_btn"
            onClick={onClose}
            className="px-5 py-2 bg-natural-olive hover:bg-natural-olive/90 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-md"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
