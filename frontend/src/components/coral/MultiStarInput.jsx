// 3축 별점 입력 (맛/양/가성비) — ReviewWritePage 전용
// value: { taste, amount, value } (각 0~5 정수)
// onChange(field, rating) 호출
import Icon from './Icon';

const AXES = [
  { key: 'taste',  label: '맛',    sub: '얼마나 맛있었나요?' },
  { key: 'amount', label: '양',    sub: '양은 충분했나요?' },
  { key: 'value',  label: '가성비', sub: '값어치 했나요?' },
];

export default function MultiStarInput({ value = {}, onChange }) {
  return (
    <div className="flex flex-col gap-[22px]">
      {AXES.map(axis => {
        const rating = value[axis.key] ?? 0;
        return (
          <div key={axis.key}>
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[17px] font-extrabold text-g900 tracking-[-0.3px]">{axis.label}</span>
                <span className="text-[12px] text-g500 ml-2">{axis.sub}</span>
              </div>
              {rating > 0 && (
                <span className="text-[14px] font-extrabold text-coral">{rating}.0</span>
              )}
            </div>
            <div className="flex gap-1.5 mt-2.5">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => onChange?.(axis.key, i + 1)}
                  className="active:scale-110"
                  style={{ transition: 'transform 150ms ease' }}
                >
                  <Icon
                    name={i < rating ? 'star' : 'starO'}
                    size={32}
                    color={i < rating ? '#FF6B5C' : '#D1D6DB'}
                    weight={1.6}
                  />
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
