import { useState } from 'react';
import { X, Copy, Check, QrCode, Sparkles } from 'lucide-react';
import { getUrlWithRoster } from '../lib/firestoreService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherNames: string[];
}

export default function ShareModal({ isOpen, onClose, teacherNames }: ShareModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(true);

  // Full generated URL containing roster query string
  const fullShareUrl = getUrlWithRoster(teacherNames);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullShareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(fullShareUrl)}&color=2e402d&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-natural-border rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-natural-text/50 hover:text-natural-olive p-1 rounded-full hover:bg-natural-bg transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border mb-4">
          <div className="w-9 h-9 rounded-xl bg-natural-light-sage text-natural-deep-green flex items-center justify-center font-bold">
            🔗
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-natural-olive">
              연수생 전광판 공유하기
            </h3>
            <p className="text-xs text-natural-text/70">
              현재 교사 명단({teacherNames.length}명)이 포함된 생성 주소입니다.
            </p>
          </div>
        </div>

        {/* Main Share URL Box */}
        <div className="p-4 bg-natural-bg border border-natural-border rounded-xl space-y-2.5 text-left mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-natural-olive flex items-center gap-1">
              <Sparkles size={14} className="text-natural-sand" />
              전광판 전용 공유 주소
            </span>
            <span className="text-[10px] bg-natural-light-sage text-natural-deep-green px-2 py-0.5 rounded-full font-bold">
              명단 자동 포함
            </span>
          </div>

          <div className="p-2.5 bg-white border border-natural-border rounded-lg text-xs font-mono text-natural-text break-all select-all leading-relaxed max-h-24 overflow-y-auto">
            {fullShareUrl}
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full py-2.5 bg-natural-deep-green hover:bg-natural-olive text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? '클립보드에 복사되었습니다!' : '전광판 공유 주소 복사하기'}
          </button>
        </div>

        {/* QR Code Section */}
        <div className="pt-2 border-t border-natural-border flex flex-col items-center">
          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full py-2 bg-natural-soft-bg hover:bg-natural-border/50 text-natural-text text-xs font-bold rounded-xl border border-natural-border flex items-center justify-center gap-2 transition-all cursor-pointer mb-3"
          >
            <QrCode size={16} className="text-natural-sand" />
            {showQr ? 'QR 코드 접기' : '현장 연수용 QR 코드 열기 (프로젝터용)'}
          </button>

          {showQr && (
            <div className="p-4 bg-white border border-natural-border rounded-2xl flex flex-col items-center gap-2 animate-fade-in mb-3">
              <img
                src={qrImageUrl}
                alt="연수생 접속 QR 코드"
                className="w-48 h-48 border border-natural-border rounded-xl p-1 bg-white shadow-inner"
              />
              <p className="text-[11px] text-natural-text/70 font-medium text-center">
                연수생들이 카메라로 QR 코드를 스캔하면<br />
                자동으로 교사 명단이 등록된 연수 전광판에 접속됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Footer Confirm */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-natural-olive text-white text-xs font-bold rounded-xl hover:bg-natural-deep-green transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
}
