import Icon from './Icon';

const BG_ICON_COLOR = {
  '#FCE3C9': '#EF8A3D',
  '#FBE6A6': '#C89A2A',
  '#CDE5C8': '#4A8F5B',
  '#F6C7A8': '#EF8A3D',
};

export default function FoodIllust({ kind = 'bowl', size = 80, bg = '#FCE3C9' }) {
  const iconColor = BG_ICON_COLOR[bg] ?? '#2B2218';
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      border: '1.5px solid #2B2218',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      boxShadow: '1px 2px 0 rgba(43,34,24,0.10)',
    }}>
      <Icon name={kind} size={size * 0.55} color={iconColor} stroke={2} />
    </div>
  );
}
