import { Emotion, Teacher } from '../types';
import { EMOTIONS, CATEGORIES } from '../data/emotions';
import { useState, useEffect } from 'react';
import { Smile, AlertCircle, Sparkles, MessageSquarePlus, Send } from 'lucide-react';

interface EmotionBoardProps {
  selectedTeacherId: string | null;
  teachers: Teacher[];
  onSelectEmotion: (emotionId?: string, customNote?: string) => void;
}

type CategoryFilter = 'all' | 'positive' | 'exhausted' | 'funny' | 'realistic' | 'focused';

export default function EmotionBoard({
  selectedTeacherId,
  teachers,
  onSelectEmotion,
}: EmotionBoardProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [noteInput, setNoteInput] = useState<string>('');

  const selectedTeacher = teachers.find((t) => t.id === selectedTeacherId);

  // Sync note input with selected teacher's custom note
  useEffect(() => {
    if (selectedTeacher) {
      setNoteInput(selectedTeacher.customNote || '');
    } else {
      setNoteInput('');
    }
  }, [selectedTeacherId, selectedTeacher?.customNote]);

  const filteredEmotions = activeCategory === 'all'
    ? EMOTIONS
    : EMOTIONS.filter((e) => e.category === activeCategory);

  const handleSaveNoteOnly = () => {
    if (!selectedTeacherId) return;
    onSelectEmotion(selectedTeacher?.currentEmotionId, noteInput.trim());
  };

  const handleCardClick = (emotionId: string) => {
    if (!selectedTeacherId) return;
    onSelectEmotion(emotionId, noteInput.trim());
  };

  return (
    <div
      id="emotion_board_container"
      className="bg-white border border-natural-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col h-full min-h-[500px]"
    >
      
      {/* Board Header */}
      <div className="pb-3 sm:pb-4 border-b border-natural-border mb-3 sm:mb-4 text-left">
        <h3 className="text-sm sm:text-base font-bold text-natural-olive flex items-center gap-2">
          <Smile size={18} className="text-natural-sage animate-pulse" />
          오늘 나의 위트 만점 감정 & 주관식 한마디
        </h3>
        <p className="text-[11px] sm:text-xs text-natural-text/70 mt-0.5">
          현재 나의 기분 이모티콘을 선택하거나 나만의 주관식 상태 한마디를 직접 작성하세요!
        </p>
      </div>

      {/* Target Teacher Prompt banner */}
      <div className="mb-3 sm:mb-4">
        {selectedTeacher ? (
          <div className="flex items-center gap-2.5 p-3 bg-natural-light-sage/40 border border-natural-sage/30 rounded-xl text-left animate-fade-in">
            <span className="text-lg sm:text-xl">👉</span>
            <div>
              <div className="text-xs font-bold text-natural-deep-green">
                <span className="text-natural-deep-green underline decoration-natural-sand font-extrabold text-sm">{selectedTeacher.name} 선생님</span>의 상태/감정을 체크하는 중입니다.
              </div>
              <p className="text-[10px] text-natural-text/60 mt-0.5">
                주관식 한마디를 적거나 아래 이모지를 누르면 감정이 바로 기록됩니다.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 p-3 bg-natural-soft-bg/50 border border-natural-border rounded-xl text-left">
            <AlertCircle size={16} className="text-natural-sand shrink-0" />
            <div>
              <div className="text-xs font-bold text-natural-text">
                선택된 교사가 없습니다.
              </div>
              <p className="text-[10px] text-natural-text/70">
                목록에서 <strong>선생님의 이름</strong>을 먼저 콕 찝어주세요!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subjective Custom Note Box */}
      <div className="mb-3 sm:mb-4 bg-natural-soft-bg/80 p-3 sm:p-3.5 rounded-xl border border-natural-border text-left shadow-inner">
        <div className="flex items-center justify-between text-xs font-bold text-natural-olive mb-2">
          <span className="flex items-center gap-1.5">
            <MessageSquarePlus size={15} className="text-natural-sand" />
            ✍️ 주관식 상태 / 한마디 직접 입력
          </span>
          {selectedTeacher?.customNote && (
            <span className="text-[10px] text-natural-deep-green font-normal bg-natural-light-sage/60 px-2 py-0.5 rounded-full border border-natural-sage/30 truncate max-w-[150px]">
              기록: "{selectedTeacher.customNote}"
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            id="subjective_note_input"
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && selectedTeacherId && noteInput.trim()) {
                handleSaveNoteOnly();
              }
            }}
            placeholder={
              selectedTeacherId
                ? "예: 오늘 연수 실습 완전 마스터! / 아이스 아메리카노 수혈 시급..."
                : "선생님 이름을 먼저 선택하세요"
            }
            disabled={!selectedTeacherId}
            className="flex-1 px-3 py-2 text-xs bg-white border border-natural-border rounded-xl focus:outline-none focus:ring-2 focus:ring-natural-sage text-natural-text disabled:opacity-50 transition-all shadow-sm"
          />
          <button
            id="save_note_btn"
            onClick={handleSaveNoteOnly}
            disabled={!selectedTeacherId || !noteInput.trim()}
            className="px-3.5 py-2 bg-natural-sand hover:bg-natural-sand/90 disabled:bg-natural-border disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer shrink-0 flex items-center gap-1"
            title="주관식 상태 남기기"
          >
            <Send size={13} />
            <span>남기기</span>
          </button>
        </div>
      </div>

      {/* Category Tabs (Horizontally scrollable on mobile) */}
      <div className="flex gap-1.5 mb-3 sm:mb-4 overflow-x-auto pb-1 no-scrollbar shrink-0">
        <button
          id="filter_cat_all"
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-natural-olive text-white shadow-sm'
              : 'bg-natural-bg text-natural-text/70 hover:bg-natural-soft-bg border border-natural-border/50'
          }`}
        >
          전체 ({EMOTIONS.length})
        </button>
        {Object.entries(CATEGORIES).map(([key, value]) => (
          <button
            id={`filter_cat_${key}`}
            key={key}
            onClick={() => setActiveCategory(key as CategoryFilter)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeCategory === key
                ? 'bg-natural-sand text-white shadow-sm'
                : 'bg-natural-bg text-natural-text/70 hover:bg-natural-soft-bg border border-natural-border/50'
            }`}
          >
            {value.name}
          </button>
        ))}
      </div>

      {/* Emotions Grid - 2 cols on mobile, 2 sm, 3 md */}
      <div className="flex-1 overflow-y-auto pr-0.5 max-h-[520px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredEmotions.map((emotion) => {
            const categoryStyle = CATEGORIES[emotion.category];
            const isSelectable = !!selectedTeacherId;

            return (
              <button
                id={`emotion_card_${emotion.id}`}
                key={emotion.id}
                onClick={() => isSelectable && handleCardClick(emotion.id)}
                disabled={!isSelectable}
                className={`group relative text-left p-2.5 sm:p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start gap-2 sm:gap-3 h-full overflow-hidden ${
                  isSelectable
                    ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md'
                    : 'opacity-55 cursor-not-allowed'
                } ${categoryStyle.bg} ${
                  selectedTeacher?.currentEmotionId === emotion.id
                    ? 'ring-2 ring-natural-sand border-natural-sand shadow-inner bg-white'
                    : 'border-transparent'
                }`}
                title={isSelectable ? `${emotion.title} 선택` : '선생님 이름을 먼저 선택하세요'}
              >
                {/* Visual Sparkle decoration on active selection */}
                {selectedTeacher?.currentEmotionId === emotion.id && (
                  <span className="absolute top-1.5 right-1.5 text-natural-sand animate-spin">
                    <Sparkles size={12} />
                  </span>
                )}

                {/* Big Emoji Container */}
                <div className="text-2xl sm:text-3xl shrink-0 p-1 bg-white/70 rounded-lg shadow-inner group-hover:rotate-12 transition-transform">
                  {emotion.emoji}
                </div>

                {/* Title and Situational Wit Context */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] sm:text-xs font-bold text-natural-text group-hover:text-natural-olive transition-colors leading-snug">
                    {emotion.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-natural-text/60 group-hover:text-natural-text/80 transition-colors mt-0.5 font-medium leading-tight line-clamp-2">
                    {emotion.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

