export default function Icon({ name, size = 24, color = '#2B2218', stroke = 1.8 }) {
  const s = size, c = color, w = stroke;
  const paths = {
    bowl: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10 C 4 16, 8 21, 12 21 C 16 21, 20 16, 20 10 Z" />
        <path d="M3 10 L 21 10" />
        <path d="M9 6 C 9.5 7, 10.5 7, 11 6" />
        <path d="M13 5 C 13.5 6, 14.5 6, 15 5" />
      </g>
    ),
    soup: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11 L 21 11 L 19 20 L 5 20 Z" />
        <path d="M8 5 C 8 6, 9 7, 9 8 C 9 9, 8 9.5, 8 10" />
        <path d="M12 4 C 12 5.5, 13 6, 13 7.5 C 13 9, 12 9.5, 12 10" />
        <path d="M16 5 C 16 6, 17 7, 17 8 C 17 9, 16 9.5, 16 10" />
      </g>
    ),
    chop: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
        <path d="M6 3 L 10 21" />
        <path d="M10 3 L 14 21" />
        <path d="M17 3 L 17 14" />
        <ellipse cx="17" cy="18" rx="3" ry="3.5" />
      </g>
    ),
    star: (
      <path
        d="M12 3 L 14.5 9 L 21 9.5 L 16 14 L 17.5 20.5 L 12 17 L 6.5 20.5 L 8 14 L 3 9.5 L 9.5 9 Z"
        fill={c} stroke={c} strokeWidth={w * 0.7} strokeLinejoin="round"
      />
    ),
    starO: (
      <path
        d="M12 3 L 14.5 9 L 21 9.5 L 16 14 L 17.5 20.5 L 12 17 L 6.5 20.5 L 8 14 L 3 9.5 L 9.5 9 Z"
        fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round"
      />
    ),
    search: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
        <circle cx="11" cy="11" r="6" />
        <path d="M15.5 15.5 L 20 20" />
      </g>
    ),
    home: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11 L 12 3 L 21 11 L 21 20 L 3 20 Z" />
        <path d="M10 20 L 10 14 L 14 14 L 14 20" />
      </g>
    ),
    cal: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10 L 21 10" />
        <path d="M8 3 L 8 7" />
        <path d="M16 3 L 16 7" />
      </g>
    ),
    list: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8 L 16 8" />
        <path d="M8 12 L 16 12" />
        <path d="M8 16 L 13 16" />
      </g>
    ),
    user: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21 C 4 16, 8 13, 12 13 C 16 13, 20 16, 20 21" />
      </g>
    ),
    heart: (
      <path
        d="M12 20 C 5 15, 3 11, 3 8 C 3 5.5, 5 3.5, 7.5 3.5 C 9.5 3.5, 11 4.5, 12 6 C 13 4.5, 14.5 3.5, 16.5 3.5 C 19 3.5, 21 5.5, 21 8 C 21 11, 19 15, 12 20 Z"
        fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round"
      />
    ),
    gear: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3 L 12 6 M12 18 L 12 21 M3 12 L 6 12 M18 12 L 21 12 M5.5 5.5 L 7.5 7.5 M16.5 16.5 L 18.5 18.5 M5.5 18.5 L 7.5 16.5 M16.5 7.5 L 18.5 5.5" />
      </g>
    ),
    pencil: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 L 7 20 L 18 9 L 15 6 L 4 17 Z" />
        <path d="M14 7 L 17 10" />
        <path d="M3 21 L 6 18" />
      </g>
    ),
    cam: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 8 L 21 8 L 21 19 L 3 19 Z" />
        <path d="M8 8 L 9 5 L 15 5 L 16 8" />
        <circle cx="12" cy="13.5" r="3" />
      </g>
    ),
    medal: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3 L 10 10 M17 3 L 14 10 M7 3 L 17 3" />
        <circle cx="12" cy="15" r="6" />
        <path
          d="M12 12 L 12.8 13.8 L 14.8 14 L 13.3 15.4 L 13.7 17.4 L 12 16.4 L 10.3 17.4 L 10.7 15.4 L 9.2 14 L 11.2 13.8 Z"
          fill={c} stroke="none"
        />
      </g>
    ),
    fire: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 C 14 7, 17 9, 17 13 C 17 17, 14 20, 12 20 C 10 20, 7 17, 7 13 C 7 11, 9 10, 10 8 C 11 6, 11 5, 12 3 Z" />
        <path d="M12 14 C 13 16, 14 16, 14 18" />
      </g>
    ),
    chevL: (
      <path d="M14 5 L 8 12 L 14 19" fill="none" stroke={c} strokeWidth={w * 1.1} strokeLinecap="round" strokeLinejoin="round" />
    ),
    chevR: (
      <path d="M10 5 L 16 12 L 10 19" fill="none" stroke={c} strokeWidth={w * 1.1} strokeLinecap="round" strokeLinejoin="round" />
    ),
    chevD: (
      <path d="M5 9 L 12 15 L 19 9" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    ),
    x: (
      <path d="M6 6 L 18 18 M18 6 L 6 18" fill="none" stroke={c} strokeWidth={w * 1.1} strokeLinecap="round" />
    ),
    plus: (
      <path d="M12 5 L 12 19 M5 12 L 19 12" fill="none" stroke={c} strokeWidth={w * 1.2} strokeLinecap="round" />
    ),
    filter: (
      <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round">
        <path d="M3 5 L 21 5" />
        <path d="M6 12 L 18 12" />
        <path d="M10 19 L 14 19" />
      </g>
    ),
  };

  return (
    <svg width={s} height={s} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] ?? null}
    </svg>
  );
}
