// 아이콘 목록(25종): bowl/soup/chop/home/cal/list/user/chev/chevD/chevL/chevR
//   star/starO/heart/heartF/x/pencil/cam/gear/search/filter/medal/check/plus/arrow
// bell은 디자인 절대 규칙(검증 체크리스트)에 의해 제외
// SVG path는 new_handoff/source/coral-system.jsx 원본 그대로

const VB_SMALL = '0 0 14 14';
const VB_TINY  = '0 0 10 10';
const VB_STD   = '0 0 24 24';

function Content({ name, color: c, weight: w }) {
  switch (name) {
    case 'bowl':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16M5 11c0 5 3 8 7 8s7-3 7-8" /></g>;
    case 'soup':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16l-2 8H6z" /><path d="M9 5c0 2 1 2 1 4M13 4c0 2 1 2 1 4M17 5c0 2 1 2 1 4" /></g>;
    case 'chop':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5 19l9-9M8 19l9-9M5 5l3 3M16 5l3 3" /></g>;
    case 'home':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8v9H3z" /><path d="M10 20v-6h4v6" /></g>;
    case 'cal':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></g>;
    case 'list':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></g>;
    case 'user':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 5-7 8-7s7 2 8 7" /></g>;
    case 'chev':
      return <path d="M5 3l4 4-4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'chevD':
      return <path d="M2 4l3 3 3-3" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'chevL':
      return <path d="M9 3L5 7l4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'chevR':
      return <path d="M5 3l4 4-4 4" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'star':
      return <path d="M12 3l2.5 6 6.5.5-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.5-.5z" fill={c} stroke={c} strokeWidth={1} strokeLinejoin="round" />;
    case 'starO':
      return <path d="M12 3l2.5 6 6.5.5-5 4.5L17.5 21 12 17.5 6.5 21 8 14 3 9.5l6.5-.5z" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />;
    case 'heart':
      return <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />;
    case 'heartF':
      return <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" fill={c} stroke={c} strokeWidth={w} strokeLinejoin="round" />;
    case 'x':
      return <path d="M5 5l14 14M19 5L5 19" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />;
    case 'pencil':
      return <path d="M14 4l4 4-10 10H4v-4z" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'cam':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l2-2h4l2 2" /></g>;
    case 'gear':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M4.5 19.5l2-2M17.5 6.5l2-2" /></g>;
    case 'search':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><circle cx="10" cy="10" r="6" /><path d="M14.5 14.5L19 19" /></g>;
    case 'filter':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round"><path d="M3 5h18l-7 8v6l-4 2v-8z" /></g>;
    case 'medal':
      return <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="14" r="6" /><path d="M8 3l4 7 4-7" /></g>;
    case 'check':
      return <path d="M4 12l5 5L20 6" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    case 'plus':
      return <path d="M12 5v14M5 12h14" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />;
    case 'arrow':
      return <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />;
    default:
      return null;
  }
}

const SMALL_VB = new Set(['chev', 'chevL', 'chevR']);

export default function Icon({ name, size = 24, color = 'currentColor', weight = 1.6, className = '' }) {
  const viewBox = SMALL_VB.has(name) ? VB_SMALL : name === 'chevD' ? VB_TINY : VB_STD;

  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      style={{ display: 'block', flexShrink: 0 }}
      className={className}
    >
      <Content name={name} color={color} weight={weight} />
    </svg>
  );
}
