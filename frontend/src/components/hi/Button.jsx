const SIZE = {
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '10px 18px', fontSize: 15 },
  lg: { padding: '13px 22px', fontSize: 16 },
};

export default function Button({ children, primary = false, size = 'md', icon, style = {}, onClick }) {
  const { padding, fontSize } = SIZE[size] ?? SIZE.md;
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding,
        border: '1.8px solid #2B2218',
        borderRadius: 12,
        fontFamily: 'var(--font-disp)',
        fontSize,
        background: primary ? '#2B2218' : '#FBF6EC',
        color: primary ? '#FBF6EC' : '#2B2218',
        boxShadow: '2px 3px 0 rgba(43,34,24,0.18)',
        cursor: 'pointer',
        ...style,
      }}
    >
      {icon}
      {children}
    </button>
  );
}
