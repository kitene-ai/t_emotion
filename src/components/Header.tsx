import { Settings, Calendar, FileSpreadsheet, LogIn, Link2Off, Share2 } from 'lucide-react';
import { User } from 'firebase/auth';
import { SheetConfig } from '../types';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  sheetConfig: SheetConfig;
  googleUser: User | null;
  onOpenSettings: () => void;
  onShareLink: () => void;
  onGoHome?: () => void;
}

export default function Header({
  selectedDate,
  onDateChange,
  sheetConfig,
  googleUser,
  onOpenSettings,
  onShareLink,
  onGoHome,
}: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-natural-border py-4 px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      {/* App Logo & Title (Clickable Home Button) */}
      <div
        id="header_home_logo_btn"
        onClick={onGoHome}
        className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-all text-left"
        title="첫 화면으로 이동 (선택 해제 및 맨 위로)"
      >
        <div className="w-10 h-10 rounded-full bg-natural-sage flex items-center justify-center text-xl shadow-sm text-white font-bold group-hover:scale-105 transition-transform">
          🏫
        </div>
        <div className="text-left">
          <h1 className="text-xl font-bold text-natural-olive tracking-tight flex items-center gap-1.5 group-hover:text-natural-deep-green transition-colors">
            오늘의 연수 온도 : <span className="text-natural-sand font-extrabold">교사용 감정판</span>
          </h1>
          <p className="text-xs text-natural-text/70 font-medium">
            실시간 교사 감정 체크 및 구글 스프레드시트 누적 기록기
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
        
        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-natural-bg border border-natural-border rounded-xl px-3 py-1.5 text-xs text-natural-text shadow-sm font-semibold">
          <Calendar size={14} className="text-natural-sage" />
          <span>연수 날짜:</span>
          <input
            id="training_date_picker"
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="bg-transparent border-none focus:outline-none font-sans text-natural-text font-bold cursor-pointer"
          />
        </div>

        {/* Share Button */}
        <button
          id="header_share_roster_btn"
          onClick={onShareLink}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-natural-light-sage/60 hover:bg-natural-light-sage border border-natural-sage/30 text-natural-deep-green text-xs font-bold rounded-xl shadow-sm hover:scale-105 transition-all cursor-pointer"
          title="교사 명단이 포함된 전광판 공유 링크 복사"
        >
          <Share2 size={14} />
          <span className="hidden sm:inline">전광판 공유</span>
        </button>

        {/* Google Sheet Sync Status Badge */}
        {sheetConfig.spreadsheetId ? (
          <a
            id="header_sheet_link"
            href={sheetConfig.spreadsheetUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-natural-light-sage/50 hover:bg-natural-light-sage border border-natural-sage/30 text-natural-deep-green text-xs font-bold rounded-xl shadow-sm transition-all"
            title="구글 스프레드시트 열기"
          >
            <FileSpreadsheet size={14} />
            <span className="hidden md:inline">구글 시트 연동 중</span>
            <span className="md:hidden">연동됨</span>
            <span className="w-1.5 h-1.5 rounded-full bg-natural-deep-green animate-pulse"></span>
          </a>
        ) : (
          <button
            id="header_sheet_offline_btn"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-natural-soft-bg border border-natural-border text-natural-text/70 text-xs font-bold rounded-xl shadow-sm hover:bg-natural-border/50 transition-colors cursor-pointer"
            title="구글 시트 연동해서 누가기록 하기"
          >
            <Link2Off size={14} className="text-natural-text/50" />
            <span className="hidden md:inline">오프라인 모드</span>
            <span className="md:hidden">오프라인</span>
          </button>
        )}

        {/* Google User Avatar (shown only when logged in) */}
        {googleUser && (
          <button
            id="header_user_profile_btn"
            onClick={onOpenSettings}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-natural-bg hover:bg-natural-soft-bg border border-natural-border rounded-xl text-xs font-bold text-natural-text shadow-sm transition-colors cursor-pointer"
            title="연동 계정 정보 (설정 열기)"
          >
            {googleUser.photoURL ? (
              <img
                src={googleUser.photoURL}
                alt="Avatar"
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full border border-natural-border"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-natural-light-sage text-natural-deep-green flex items-center justify-center font-bold">
                {googleUser.displayName?.[0] || 'T'}
              </div>
            )}
            <span className="max-w-[80px] truncate">{googleUser.displayName} 님</span>
          </button>
        )}

        {/* Setup Gear Button */}
        <button
          id="header_settings_btn"
          onClick={onOpenSettings}
          className="p-2 bg-natural-bg hover:bg-natural-soft-bg text-natural-text border border-natural-border rounded-xl shadow-sm hover:text-natural-sand hover:border-natural-sand hover:rotate-45 transition-all cursor-pointer"
          title="설정창 열기 (교사 명단 및 구글 시트)"
        >
          <Settings size={18} />
        </button>

      </div>
    </header>
  );
}
