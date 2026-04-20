export default function SecLabel({ children, right }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    }}>
      <div style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 17,
        color: '#2B2218',
      }}>
        {children}
      </div>
      {right}
    </div>
  );
}
