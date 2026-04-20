export default function Card({ children, style = {}, bg = '#fff', shadow = true, round = 16 }) {
  return (
    <div style={{
      background: bg,
      border: '1.5px solid #2B2218',
      borderRadius: round,
      boxShadow: shadow ? '2px 3px 0 rgba(43,34,24,0.12)' : 'none',
      ...style,
    }}>
      {children}
    </div>
  );
}
