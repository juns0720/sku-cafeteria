// Coral 디자인 시스템 — 토스 스타일 공통 primitives
// 모든 Coral 화면이 이 파일의 helper를 사용

const CORAL_FONT = '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", system-ui, sans-serif';

// 그레이 스케일
const CG = {
  white: '#FFFFFF',
  g50: '#F9FAFB',
  g100: '#F2F4F6',
  g200: '#E5E8EB',
  g300: '#D1D6DB',
  g400: '#B0B8C1',
  g500: '#8B95A1',
  g600: '#6B7684',
  g700: '#4E5968',
  g800: '#333D4B',
  g900: '#191F28'
};

// 액센트 (기본) — 별 색도 코랄 그대로 사용
const CORAL = {
  main: '#FF6B5C',
  soft: '#FFEEEC',
  star: '#FF6B5C'
};

// 모든 카테고리 동일 — 단조로움 회피용 컬러 제거 (기준 디자인 따라 단색 그레이)
const CAT_BG = {
  '한식': '#F2F4F6',
  '양식': '#F2F4F6',
  '일품': '#F2F4F6',
  '분식': '#F2F4F6',
  '중식': '#F2F4F6',
  '특식': '#F2F4F6'
};

// ─────────── Icon ───────────
function CIcon({ k, size = 22, c = CG.g900, w = 1.7 }) {
  const p = {
    bowl: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16M5 11c0 5 3 8 7 8s7-3 7-8" /></g>,
    soup: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16l-2 8H6z" /><path d="M9 5c0 2 1 2 1 4M13 4c0 2 1 2 1 4M17 5c0 2 1 2 1 4" /></g>,
    chop: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5 19l9-9M8 19l9-9M5 5l3 3M16 5l3 3" /></g>,
    home: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v9H3z" /><path d="M10 20v-6h4v6" /></g>,
    cal: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></g>,
    list: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></g>,
    user: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 5-7 8-7s7 2 8 7" /></g>,
    chev: <path d="M5 3l4 4-4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    chevD: <path d="M2 4l3 3 3-3" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    chevL: <path d="M9 3L5 7l4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    chevR: <path d="M5 3l4 4-4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    star: <path d="M12 3l2.5 6 6.5.5-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.5-.5z" fill={c} stroke={c} strokeWidth={1} strokeLinejoin="round" />,
    starO: <path d="M12 3l2.5 6 6.5.5-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.5-.5z" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />,
    bell: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1 2H5z" /><path d="M10 20a2 2 0 0 0 4 0" /></g>,
    heart: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />,
    heartF: <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill={c} stroke={c} strokeWidth={w} strokeLinejoin="round" />,
    x: <path d="M5 5l14 14M19 5L5 19" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />,
    pencil: <path d="M14 4l4 4-10 10H4v-4z" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    cam: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l2-2h4l2 2" /></g>,
    gear: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" /></g>,
    search: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L19 19" /></g>,
    filter: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M3 5h18l-7 8v6l-4 2v-8z" /></g>,
    medal: <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="6" /><path d="M8 3l4 7 4-7" /></g>,
    check: <path d="M4 12l5 5L20 6" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
    plus: <path d="M12 5v14M5 12h14" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  };
  const vb = k === 'chev' || k === 'chevL' || k === 'chevR' ? '0 0 14 14' :
  k === 'chevD' ? '0 0 10 10' : '0 0 24 24';
  return <svg width={size} height={size} viewBox={vb} style={{ display: 'block', flexShrink: 0, opacity: "1" }}>{p[k]}</svg>;
}

// ─────────── Frame ───────────
function CFrame({ children, bg = CG.white }) {
  return (
    <div style={{
      width: 375, height: 760,
      background: bg, color: CG.g900,
      borderRadius: 32, overflow: 'hidden',
      fontFamily: CORAL_FONT,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0
    }}>{children}</div>);

}

// ─────────── Status Bar ───────────
function CStatus({ darkBg = false }) {
  const c = darkBg ? '#fff' : CG.g900;
  return (
    <div style={{
      height: 32, padding: '0 22px', flexShrink: 0,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 14, fontWeight: 600, color: c
    }}>
      <span>11:47</span>
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 2h2v8h-2z" fill={c} /></svg>
        <svg width="22" height="11" viewBox="0 0 22 11">
          <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke={c} fill="none" />
          <rect x="2" y="2" width="14" height="7" rx="1.5" fill={c} />
          <rect x="19.5" y="3.5" width="2" height="4" rx="1" fill={c} />
        </svg>
      </div>
    </div>);

}

// ─────────── Tab Bar ───────────
function CTab({ active = 'home', accent = CORAL.main }) {
  const tabs = [
  { k: 'home', l: '홈', i: 'home' },
  { k: 'week', l: '주간', i: 'cal' },
  { k: 'all', l: '전체', i: 'list' },
  { k: 'me', l: '프로필', i: 'user' }];

  return (
    <div style={{
      flexShrink: 0, height: 64, padding: '8px 0',
      borderTop: `1px solid ${CG.g100}`,
      background: CG.white, display: 'flex'
    }}>
      {tabs.map((t) => {
        const a = t.k === active;
        return (
          <div key={t.k} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 4
          }}>
            <CIcon k={t.i} size={22} c={a ? accent : CG.g400} w={a ? 2 : 1.6} />
            <span style={{ fontSize: 11, fontWeight: a ? 700 : 500, color: a ? accent : CG.g500 }}>{t.l}</span>
          </div>);

      })}
    </div>);

}

// ─────────── Stars (작은 별 5개) ───────────
function CStars({ value = 5, size = 13, c = CORAL.star }) {
  return (
    <div style={{ display: 'inline-flex', gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) =>
      <CIcon key={i} k={i < Math.round(value) ? 'star' : 'starO'} size={size} c={i < Math.round(value) ? c : CG.g300} w={1.5} />
      )}
    </div>);

}

// ─────────── Top Header (back / title / right) ───────────
function CHeader({ onBack = true, title, right }) {
  return (
    <div style={{
      padding: '6px 16px 12px', flexShrink: 0,
      display: 'flex', alignItems: 'center', gap: 8,
      minHeight: 48
    }}>
      {onBack ?
      <div style={{
        width: 36, height: 36, borderRadius: 18,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginLeft: -8
      }}>
          <CIcon k="chevL" size={20} c={CG.g900} w={2} />
        </div> :
      <div style={{ width: 0 }} />}
      <div style={{ flex: 1, fontSize: 17, fontWeight: 700, letterSpacing: -0.4 }}>{title}</div>
      {right}
    </div>);

}

// ─────────── Pill / Chip ───────────
function CChip({ active, children, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: '8px 14px',
      background: active ? CG.g900 : CG.g100,
      color: active ? '#fff' : CG.g700,
      borderRadius: 999,
      fontSize: 13, fontWeight: 600, letterSpacing: -0.2,
      flexShrink: 0
    }}>{children}</div>);

}

// ─────────── Section header ───────────
function CSec({ children, right, sub }) {
  return (
    <div style={{ padding: '0 24px 12px', flexShrink: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4, color: CG.g900 }}>
          {children}
        </div>
        {right}
      </div>
      {sub && <div style={{ fontSize: 12, color: CG.g500, marginTop: 2 }}>{sub}</div>}
    </div>);

}

// ─────────── 음식 썸네일 — 단색 그레이 + g500 아이콘 (기준 디자인) ───────────
function CThumb({ ill = 'bowl', size = 56, cat = '한식', radius = 14 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, background: CG.g100,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <CIcon k={ill} size={Math.round(size * 0.45)} c={CG.g600} w={1.6} />
    </div>);

}

// ─────────── Button ───────────
function CButton({ primary, size = 'md', children, icon, style, ...rest }) {
  const sz = size === 'lg' ?
  { padding: '16px 20px', fontSize: 16, borderRadius: 14 } :
  { padding: '11px 16px', fontSize: 14, borderRadius: 12 };
  return (
    <button {...rest} style={{
      ...sz,
      fontWeight: 700, letterSpacing: -0.3,
      background: primary ? CORAL.main : CG.g100,
      color: primary ? '#fff' : CG.g900,
      border: 'none', cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontFamily: CORAL_FONT,
      ...style
    }}>
      {icon}{children}
    </button>);

}

Object.assign(window, {
  CORAL_FONT, CG, CORAL, CAT_BG,
  CIcon, CFrame, CStatus, CTab, CStars, CHeader, CChip, CSec, CThumb, CButton
});