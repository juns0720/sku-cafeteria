export default function Pill({
  children,
  bg = '#FCE3C9',
  color = '#2B2218',
  border = '#2B2218',
  icon,
  style = {},
}) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      padding: '2px 9px',
      border: `1.5px solid ${border}`,
      borderRadius: 999,
      background: bg,
      fontFamily: 'var(--font-hand)',
      fontSize: 12,
      fontWeight: 700,
      color,
      ...style,
    }}>
      {icon}
      {children}
    </span>
  );
}
