import { Teacher, Emotion } from '../types';
import { EMOTIONS } from '../data/emotions';
import { UserCheck, Trash2, Search, SmilePlus } from 'lucide-react';
import { useState } from 'react';

interface TeacherListProps {
  teachers: Teacher[];
  selectedTeacherId: string | null;
  onSelectTeacher: (id: string) => void;
  onResetEmotion: (id: string) => void;
  onResetAll: () => void;
}

export default function TeacherList({
  teachers,
  selectedTeacherId,
  onSelectTeacher,
  onResetEmotion,
  onResetAll,
}: TeacherListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Find emotion helper
  const getTeacherEmotion = (emotionId?: string): Emotion | undefined => {
    if (!emotionId) return undefined;
    return EMOTIONS.find((e) => e.id === emotionId);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const checkedCount = teachers.filter((t) => t.currentEmotionId).length;
  const totalCount = teachers.length;

  return (
    <div className="bg-white border border-natural-border rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-[500px]">
      {/* Header and Quick Stats */}
      <div className="flex flex-col gap-3 pb-4 border-b border-natural-border">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-natural-olive flex items-center gap-2">
            <UserCheck size={18} className="text-natural-sage" />
            연수 교사 명단 ({totalCount}명)
          </h3>
          {totalCount > 0 && (
            <button
              id="reset_all_teachers_btn"
              onClick={() => {
                if (window.confirm('모든 교사의 오늘 감정 상태를 초기화하시겠습니까? (구글 시트의 기존 기록은 유지됩니다)')) {
                  onResetAll();
                }
              }}
              className="text-xs text-[#BC6C25] hover:text-natural-sand font-semibold flex items-center gap-1 hover:underline transition-all cursor-pointer"
              title="모든 교사 감정 초기화"
            >
              <Trash2 size={13} />
              전체 초기화
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 gap-2 bg-natural-bg p-2.5 rounded-xl text-xs text-natural-text font-semibold border border-natural-border">
          <div className="text-center border-r border-natural-border">
            <span className="text-natural-text/60 mr-1">체크 완료:</span>
            <span className="text-natural-deep-green font-bold">{checkedCount}명</span>
          </div>
          <div className="text-center">
            <span className="text-natural-text/60 mr-1">미체크:</span>
            <span className="text-natural-sand font-bold">{totalCount - checkedCount}명</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-natural-text/40" />
          <input
            id="search_teacher_input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="교사 이름 검색..."
            className="w-full pl-9 pr-4 py-2 bg-natural-bg border border-natural-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-natural-sage focus:bg-white transition-all text-natural-text"
          />
        </div>
      </div>

      {/* Roster Layout */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-1 max-h-[600px]">
        {totalCount === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-natural-text/60 text-center px-4 py-8">
            <span className="text-3xl mb-2">👤</span>
            <p className="text-xs font-bold text-natural-olive">등록된 교사가 없습니다.</p>
            <p className="text-[10px] text-natural-text/60 mt-1">우측 상단 설정창(⚙️)에서 교사 명단을 먼저 추가해주세요!</p>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="text-center text-natural-text/50 text-xs py-12">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {filteredTeachers.map((teacher) => {
              const emotion = getTeacherEmotion(teacher.currentEmotionId);
              const isSelected = selectedTeacherId === teacher.id;

              return (
                <div
                  id={`teacher_card_${teacher.id}`}
                  key={teacher.id}
                  onClick={() => onSelectTeacher(teacher.id)}
                  className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-natural-sand bg-natural-soft-bg/50 shadow-md ring-2 ring-natural-sand/20'
                      : 'border-natural-border hover:border-natural-sand/40 bg-white hover:bg-natural-bg'
                  }`}
                >
                  {/* Left: Name and Avatar */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-natural-sage text-white'
                          : emotion
                          ? 'bg-natural-light-sage text-natural-deep-green'
                          : 'bg-natural-soft-bg text-natural-text/60'
                      }`}
                    >
                      {teacher.name[0]}
                    </div>
                    
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-natural-text truncate">
                          {teacher.name}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-natural-deep-green bg-natural-light-sage px-1.5 py-0.5 rounded-md animate-bounce">
                            체크 중
                          </span>
                        )}
                      </div>
                      
                      {/* Emotion description */}
                      {emotion ? (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-natural-deep-green font-semibold truncate">
                          <span className="text-sm shrink-0">{emotion.emoji}</span>
                          <span className="truncate">{emotion.title}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] text-natural-text/50">
                          <SmilePlus size={10} className="shrink-0" />
                          <span>아직 감정 체크 전</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Reset Button (only if check existing) */}
                  {emotion && (
                    <button
                      id={`reset_teacher_emotion_${teacher.id}`}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents selection trigger
                        onResetEmotion(teacher.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded-lg transition-all shrink-0 ml-1 cursor-pointer"
                      title="이 감정 비우기"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Guide label at bottom */}
      {totalCount > 0 && (
        <div className="mt-4 p-3 bg-natural-soft-bg/50 rounded-xl border border-natural-border text-center">
          <p className="text-[11px] font-bold text-natural-olive leading-normal">
            💡 사용 방법: 먼저 왼편의 <strong>내 이름</strong>을 클릭한 후,<br />
            오른편에서 <strong>지금 내 감정</strong>을 꾹 눌러 체크하세요!
          </p>
        </div>
      )}
    </div>
  );
}
