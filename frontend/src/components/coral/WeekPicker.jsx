// 월~금 5분할 요일 탭 — WeeklyPage 전용
// active: g900/white, inactive: g50/g600
// days: [{label: '월', date: 20}, ...]
export default function WeekPicker({ days = [], activeIndex = 0, onSelect }) {
  return (
    <div className="flex gap-1.5 px-[18px] flex-shrink-0">
      {days.map((day, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={i}
            onClick={() => onSelect?.(i)}
            className={`
              flex-1 py-3 rounded-2xl text-center
              ${active ? 'bg-g900 text-white' : 'bg-g50 text-g600'}
            `}
          >
            <div className="text-[12px] font-semibold" style={{ opacity: active ? 1 : 0.85 }}>
              {day.label}
            </div>
            <div className="text-[19px] font-extrabold mt-0.5 tracking-[-0.3px]">
              {day.date}
            </div>
          </button>
        );
      })}
    </div>
  );
}
