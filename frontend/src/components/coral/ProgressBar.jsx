// 다음 뱃지 진행도 카드 — ProfilePage 전용
// 트랙: g100, fill: coral, height: 10px (DESIGN.md)
export default function ProgressBar({ current, target, nextTierLabel, remaining }) {
  const pct = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  return (
    <div className="p-3.5 rounded-[14px] bg-g50">
      <div className="flex justify-between items-center">
        <span className="text-[13px] font-semibold text-g700">
          다음 뱃지 <span className="font-extrabold text-g900">{nextTierLabel}</span>까지
        </span>
        <span className="text-[13px] font-extrabold text-coral">{remaining}개 남음</span>
      </div>
      <div className="mt-2.5 h-2.5 bg-g100 rounded-full overflow-hidden">
        <div
          className="h-full bg-coral rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[11px] font-semibold text-g500">{current}</span>
        <span className="text-[11px] font-semibold text-g500">{target}</span>
      </div>
    </div>
  );
}
