export default function UL({ children, color = '#EF8A3D' }) {
  const encoded = encodeURIComponent(color);
  return (
    <span style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 6'%3E%3Cpath d='M0 3 Q 2.5 0, 5 3 T 10 3 T 15 3 T 20 3' fill='none' stroke='${encoded}' stroke-width='2'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'repeat-x',
      backgroundPosition: '0 100%',
      backgroundSize: '14px 5px',
      paddingBottom: 6,
    }}>
      {children}
    </span>
  );
}
