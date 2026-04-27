// 메뉴 메달 원형 스티커 — AllMenusPage 리스트 행 우측
// tier: 'GOLD' | 'SILVER' | 'BRONZE' | null
const CONFIG = {
  GOLD:   { emoji: '🥇', bg: '#FFEEEC' },
  SILVER: { emoji: '🥈', bg: '#F2F4F6' },
  BRONZE: { emoji: '🥉', bg: '#F2F4F6' },
};

export default function MedalDot({ tier }) {
  if (!tier || !CONFIG[tier]) return null;
  const { emoji, bg } = CONFIG[tier];
  return (
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: bg }}
    >
      <span className="text-[14px] leading-none">{emoji}</span>
    </div>
  );
}
