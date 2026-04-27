// 통계 카드 3-grid — ProfilePage 전용
// items: [{value: string|number, label: string}]
export default function StatsGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(stat => (
        <div key={stat.label} className="py-3.5 px-2 text-center bg-g50 rounded-[14px]">
          <div className="text-[22px] font-extrabold tracking-[-0.5px] text-g900">{stat.value}</div>
          <div className="text-[11px] font-semibold text-g600 mt-0.5">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
