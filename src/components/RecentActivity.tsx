import { EMOTIONS } from '../data/emotions';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ActivityLog {
  id: string;
  teacherName: string;
  emoji: string;
  emotionTitle: string;
  time: string;
}

interface RecentActivityProps {
  logs: ActivityLog[];
}

export default function RecentActivity({ logs }: RecentActivityProps) {
  return (
    <div className="bg-white border border-natural-border rounded-2xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-natural-olive flex items-center gap-2 mb-3 pb-2 border-b border-natural-border">
        <Clock size={16} className="text-natural-sage" />
        실시간 감정 등록 피드 (최근 기록)
      </h3>
      
      {logs.length === 0 ? (
        <div className="text-center py-6 text-xs text-natural-text/50">
          아직 오늘의 감정 체크 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
          {logs.slice().reverse().map((log) => (
            <div
              id={`activity_feed_item_${log.id}`}
              key={log.id}
              className="flex items-center justify-between p-2.5 bg-natural-bg border border-natural-border/60 rounded-xl text-left hover:bg-natural-soft-bg transition-colors animate-fade-in"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xl shrink-0 p-0.5 bg-white rounded-md shadow-sm">
                  {log.emoji}
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-natural-text mr-1.5">
                    {log.teacherName} 선생님
                  </span>
                  <span className="text-[10px] text-natural-text/70 font-medium">
                    "{log.emotionTitle}"
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-natural-text/50 font-mono shrink-0 ml-2 flex items-center gap-1">
                <CheckCircle2 size={10} className="text-natural-deep-green shrink-0" />
                {log.time}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
