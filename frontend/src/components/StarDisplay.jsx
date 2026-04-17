import { Star } from 'lucide-react';

const SIZE_MAP = {
  sm: 14,
  md: 18,
  lg: 22,
};

export default function StarDisplay({ rating = 0, size = 'md' }) {
  const px = SIZE_MAP[size] ?? SIZE_MAP.md;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => {
        const full = rating >= i + 1;
        const half = !full && rating >= i + 0.5;

        return (
          <span key={i} className="relative inline-flex" style={{ width: px, height: px }}>
            <Star
              size={px}
              className="text-gray-200"
              fill="currentColor"
              strokeWidth={0}
            />
            {(full || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: full ? '100%' : '50%' }}
              >
                <Star
                  size={px}
                  style={{ color: 'var(--color-star)' }}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
