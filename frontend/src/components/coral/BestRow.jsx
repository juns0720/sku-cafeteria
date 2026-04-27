// TOP 5 가로 스크롤 카드 — HomePage 전용
// 1위 배지: coral, 2~5위: white/g900
import Icon from './Icon';
import Stars from './Stars';

const ICON_BY_CORNER = {
  '한식': 'bowl', '양식': 'chop', '분식': 'soup', '일품': 'bowl', '중식': 'soup', '특식': 'bowl',
  KOREAN: 'bowl', WESTERN: 'chop', SNACK: 'soup', SPECIAL: 'bowl',
};

export default function BestRow({ items = [], onItemClick }) {
  return (
    <div className="overflow-x-auto scrollbar-hide pb-[22px] flex-shrink-0">
      <div className="flex gap-3 px-6 w-max">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            className="w-[124px] flex-shrink-0 text-left"
          >
            {/* Thumbnail */}
            <div className="w-[124px] h-[124px] rounded-[14px] bg-g100 relative flex items-center justify-center">
              <Icon
                name={ICON_BY_CORNER[item.corner] ?? 'bowl'}
                size={50}
                color="#8B95A1"
                weight={1.5}
              />
              {/* Rank badge */}
              <div
                className="absolute top-2 left-2 text-[11px] font-extrabold px-2 py-px rounded-full"
                style={{
                  background: i === 0 ? '#FF6B5C' : '#FFFFFF',
                  color: i === 0 ? '#FFFFFF' : '#191F28',
                }}
              >
                {i + 1}위
              </div>
            </div>

            <div className="text-[14px] font-bold mt-2 tracking-[-0.2px] text-g900 truncate">{item.name}</div>
            <div className="text-[12px] text-g500 mt-px">{item.corner}</div>

            {item.avgOverall != null && (
              <div className="flex items-center gap-1 mt-1">
                <Icon name="star" size={12} color="#FF6B5C" />
                <span className="text-[13px] font-bold text-g900">{item.avgOverall.toFixed(1)}</span>
                <span className="text-[11px] text-g500">({item.reviewCount})</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
