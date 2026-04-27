// 코너 필터 칩 가로 스크롤 — AllMenusPage 전용
import Chip from './Chip';

export default function CategoryFilter({ categories = [], active, onSelect }) {
  return (
    <div className="overflow-x-auto scrollbar-hide flex-shrink-0">
      <div className="flex gap-1.5 px-6 w-max">
        {categories.map(cat => (
          <Chip key={cat} active={active === cat} onClick={() => onSelect?.(cat)}>
            {cat}
          </Chip>
        ))}
      </div>
    </div>
  );
}
