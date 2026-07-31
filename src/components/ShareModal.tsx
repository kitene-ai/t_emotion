import { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { getUrlWithRoster } from '../lib/firestoreService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherNames: string[];
}

export default function ShareModal({ isOpen, onClose, teacherNames }: ShareModalProps) {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [tinyUrl, setTinyUrl] = useState<string>('');
  const [isLoadingTiny, setIsLoadingTiny] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Clean base URL (e.g. https://t-emotion-henna.vercel.app/ or window.location.origin)
  const baseUrl = window.location.origin + window.location.pathname;
  const longUrl = getUrlWithRoster(teacherNames);

  useEffect(() => {
    if (isOpen && !tinyUrl) {
      // Auto-fetch TinyURL for clean base url
      fetchTinyUrl(baseUrl);
    }
  }, [isOpen]);

  const fetchTinyUrl = async (targetUrl: string) => {
    setIsLoadingTiny(true);
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const short = await res.text();
        if (short && short.startsWith('http')) {
          setTinyUrl(short.trim());
        }
      }
    } catch (e) {
      console.warn('TinyURL fetch error:', e);
    } finally {
      setIsLoadingTiny(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    });
  };

  if (!isOpen) return null;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(baseUrl)}&color=2e402d&bgcolor=ffffff`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-natural-border rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-natural-text/50 hover:text-natural-olive p-1 rounded-full hover:bg-natural-bg transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-natural-border mb-4">
          <div className="w-9 h-9 rounded-xl bg-natural-light-sage text-natural-deep-green flex items-center justify-center font-bold">
            🔗
          </div>
          <div>
            <h3 className="text-base font-bold text-natural-olive">
              연수생 전광판 공유하기
            </h3>
            <p className="text-xs text-natural-text/70">
              선생님들이 스마트폰으로 참여할 수 있는 링크와 QR 코드입니다.
            </p>
          </div>
        </div>

        {/* FAQ Answer Box for user's specific question */}
        <div className="mb-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl text-left space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <ShieldCheck size={16} className="text-amber-700 shrink-0" />
            <span>질문 답변: 어떤 주소를 줘야 하나요?</span>
          </div>
          <p className="text-xs text-amber-950 leading-relaxed font-medium">
            <strong>`https://t-emotion-henna.vercel.app/` (기본 주소)만 주셔도 100% 완벽하게 접속됩니다!</strong><br />
            클라우드(Firebase) 서버에 교사 명단과 연동 상태가 실시간으로 자동 보관되어 모든 연수생 단말기에 동일하게 뜨므로, 긴 주소를 보낼 필요가 전혀 없습니다.
          </p>
        </div>

        {/* Option 1: Clean Base URL (Recommended) */}
        <div className="space-y-3 mb-4 text-left">
          <div className="p-3.5 bg-natural-bg border border-natural-border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-natural-olive flex items-center gap-1">
                <Sparkles size={14} className="text-natural-sand" />
                [추천 1] 깔끔한 대표 주소
              </span>
              <span className="text-[10px] bg-natural-light-sage text-natural-deep-green px-2 py-0.5 rounded-full font-bold">
                클라우드 실시간 연동
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 border border-natural-border rounded-lg">
              <span className="text-xs font-mono text-natural-text truncate flex-1">
                {baseUrl}
              </span>
              <button
                onClick={() => copyToClipboard(baseUrl, 'base')}
                className="px-3 py-1.5 bg-natural-deep-green hover:bg-natural-olive text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                {copiedType === 'base' ? <Check size={13} /> : <Copy size={13} />}
                {copiedType === 'base' ? '복사됨!' : '주소 복사'}
              </button>
            </div>
          </div>

          {/* Option 2: TinyURL Short Link */}
          <div className="p-3.5 bg-natural-bg border border-natural-border rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-natural-olive flex items-center gap-1">
                ⚡ [추천 2] 1초 단축 링크 (TinyURL)
              </span>
              <span className="text-[10px] text-natural-text/60 font-medium">
                메신저/문자 전송용
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white p-2 border border-natural-border rounded-lg">
              <span className="text-xs font-mono text-natural-text truncate flex-1">
                {isLoadingTiny ? '단축 링크 생성 중...' : tinyUrl || baseUrl}
              </span>
              <button
                onClick={() => copyToClipboard(tinyUrl || baseUrl, 'tiny')}
                disabled={isLoadingTiny}
                className="px-3 py-1.5 bg-natural-sand hover:bg-natural-sand/90 text-white text-xs font-bold rounded-md flex items-center gap-1 transition-all shrink-0 cursor-pointer"
              >
                {copiedType === 'tiny' ? <Check size={13} /> : <Copy size={13} />}
                {copiedType === 'tiny' ? '복사됨!' : '단축주소 복사'}
              </button>
            </div>
          </div>
        </div>

        {/* QR Code Section Toggle */}
        <div className="pt-2 border-t border-natural-border flex flex-col items-center">
          <button
            onClick={() => setShowQr(!showQr)}
            className="w-full py-2.5 bg-natural-soft-bg hover:bg-natural-border/50 text-natural-text text-xs font-bold rounded-xl border border-natural-border flex items-center justify-center gap-2 transition-all cursor-pointer mb-3"
          >
            <QrCode size={16} className="text-natural-sand" />
            {showQr ? 'QR 코드 접기' : '현장 연수용 QR 코드 화면 열기 (프로젝터용)'}
          </button>

          {showQr && (
            <div className="p-4 bg-white border border-natural-border rounded-2xl flex flex-col items-center gap-2 animate-fade-in mb-3">
              <img
                src={qrImageUrl}
                alt="연수생 접속 QR 코드"
                className="w-48 h-48 border border-natural-border rounded-xl p-1 bg-white shadow-inner"
              />
              <p className="text-[11px] text-natural-text/70 font-medium mt-1">
                스마트폰 카메라로 스캔하면 바로 연수 감정판으로 연결됩니다.
              </p>
            </div>
          )}
        </div>

        {/* Option 3: Long URL (Roster embedded) for fallback */}
        <details className="mt-2 text-left group">
          <summary className="text-[11px] text-natural-text/50 hover:text-natural-text cursor-pointer font-medium select-none">
            ▸ 명단 매개변수가 포함된 긴 주소 보기 (오프라인 백업용)
          </summary>
          <div className="mt-2 p-2 bg-natural-bg rounded-lg border border-natural-border text-[10px] font-mono break-all text-natural-text/70 space-y-1">
            <p className="line-clamp-2">{longUrl}</p>
            <button
              onClick={() => copyToClipboard(longUrl, 'long')}
              className="mt-1 px-2 py-1 bg-white border border-natural-border text-natural-text text-[10px] font-bold rounded hover:bg-natural-soft-bg flex items-center gap-1 cursor-pointer"
            >
              {copiedType === 'long' ? <Check size={11} /> : <Copy size={11} />}
              {copiedType === 'long' ? '복사됨' : '긴 주소 복사'}
            </button>
          </div>
        </details>

        {/* Footer Confirm */}
        <div className="mt-5 text-right">
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
