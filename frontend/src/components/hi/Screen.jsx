export default function Screen({ children, bg = '#FBF6EC', label, sub }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {label && (
        <div style={{ position: 'absolute', bottom: '100%', left: 0, paddingBottom: 12 }}>
          <div style={{ fontFamily: 'var(--font-disp)', fontSize: 16, color: '#2B2218' }}>{label}</div>
          {sub && <div style={{ fontFamily: 'var(--font-hand)', fontSize: 13, color: '#8E7A66', marginTop: 2 }}>{sub}</div>}
        </div>
      )}
      <div style={{
        width: 375,
        minHeight: 760,
        background: bg,
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-hand)',
        color: '#2B2218',
        boxShadow: '0 2px 8px rgba(43,34,24,0.08), 0 12px 40px rgba(43,34,24,0.1)',
        border: '1.5px solid #D8CBB6',
      }}>
        {children}
      </div>
    </div>
  );
}
