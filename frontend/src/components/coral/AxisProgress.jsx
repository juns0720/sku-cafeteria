// 메뉴 상세 3축 평균 막대 (5분할, fill coral) — MenuDetailPage 전용
// null 이면 '-' 표시
const AXES = [
  { key: 'taste',  label: '맛' },
  { key: 'amount', label: '양' },
  { key: 'value',  label: '가성비' },
];

export default function AxisProgress({ taste, amount, value }) {
  const values = { taste, amount, value };
  return (
    <div className="p-4 rounded-2xl bg-g50 grid grid-cols-3 gap-2">
      {AXES.map(axis => {
        const val = values[axis.key];
        const pct = val != null ? `${(val / 5) * 100}%` : '0%';
        return (
          <div key={axis.key} className="text-center">
            <div className="text-[12px] font-semibold text-g600">{axis.label}</div>
            <div className="text-[22px] font-extrabold text-g900 mt-0.5 tracking-[-0.5px]">
              {val != null ? val.toFixed(1) : '-'}
            </div>
            <div className="h-1 bg-g200 rounded-full mt-1.5 overflow-hidden">
              <div className="h-full bg-coral rounded-full" style={{ width: pct }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
