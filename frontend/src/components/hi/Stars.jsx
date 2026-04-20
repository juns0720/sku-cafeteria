import Icon from './Icon';

const SIZE_MAP = { sm: 10, md: 14, lg: 32 };

export default function Stars({ value = 0, size = 'md', total = 5, color = '#F4B73B' }) {
  const px = typeof size === 'number' ? size : (SIZE_MAP[size] ?? 14);
  return (
    <div style={{ display: 'inline-flex', gap: 1 }}>
      {Array.from({ length: total }).map((_, i) => (
        <Icon
          key={i}
          name={i < Math.round(value) ? 'star' : 'starO'}
          size={px}
          color={color}
          stroke={1.5}
        />
      ))}
    </div>
  );
}
