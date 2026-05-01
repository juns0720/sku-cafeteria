export default function AxisBar({ label, value, color = '#EF8A3D' }) {
  const pct = Math.min(Math.max((value / 5) * 100, 0), 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 48,
        fontFamily: 'var(--font-hand)',
        fontSize: 13,
        fontWeight: 700,
        color: '#574635',
      }}>
        {label}
      </div>
      <div style={{
        flex: 1,
        height: 10,
        background: '#F4ECDC',
        border: '1.5px solid #2B2218',
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
      <div style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 14,
        color: '#2B2218',
        minWidth: 24,
        textAlign: 'right',
      }}>
        {typeof value === 'number' ? value.toFixed(1) : value}
      </div>
    </div>
  );
}
