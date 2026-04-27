/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        fadeIn: 'fadeIn 0.2s ease forwards',
        fadeInUp: 'fadeInUp 0.3s ease forwards',
        slideUp: 'slideUp 0.25s ease forwards',
      },
      backgroundSize: {
        '200': '200% 100%',
      },
      colors: {
        // ── v3 Coral ──────────────────────────────────────────────
        coral:     '#FF6B5C',
        coralSoft: '#FFEEEC',
        g50:  '#F9FAFB',
        g100: '#F2F4F6',
        g200: '#E5E8EB',
        g300: '#D1D6DB',
        g400: '#B0B8C1',
        g500: '#8B95A1',
        g600: '#6B7684',
        g700: '#4E5968',
        g800: '#333D4B',
        g900: '#191F28',
        // ── v2 (Phase v3-3 V3-T17에서 일괄 제거) ─────────────────
        paper: '#FBF6EC',
        paperDeep: '#F4ECDC',
        ink: '#2B2218',
        inkSoft: '#574635',
        mute: '#8E7A66',
        rule: '#D8CBB6',
        orange: '#EF8A3D',
        orangeSoft: '#FCE3C9',
        yellow: '#F4B73B',
        yellowSoft: '#FBE6A6',
        green: '#4A8F5B',
        greenSoft: '#CDE5C8',
        peach: '#F6C7A8',
        red: '#D9543A',
        primary: '#D94148',
        'primary-dark': '#B93540',
        'primary-light': '#FDEAEB',
        star: '#FBBF24',
        surface: '#F8F8F8',
        success: '#22C55E',
        error: '#D94148',
      },
      fontFamily: {
        // ── v3 Coral ──────────────────────────────────────────────
        pretendard: ['Pretendard', '-apple-system', 'BlinkMacSystemFont',
                     'Apple SD Gothic Neo', 'system-ui', 'sans-serif'],
        // ── v2 (Phase v3-3 V3-T17에서 제거) ──────────────────────
        hand: ['Gaegu', 'system-ui', 'sans-serif'],
        disp: ['Jua', 'system-ui', 'sans-serif'],
        user: ['Noto Sans KR', 'Apple SD Gothic Neo', 'Malgun Gothic', 'system-ui', 'sans-serif'],
        sans: ['Pretendard', 'sans-serif'],
      },
      boxShadow: {
        // ── v3 Coral ──────────────────────────────────────────────
        frame:    '0 2px 8px rgba(0,0,0,0.06), 0 12px 40px rgba(0,0,0,0.08)',
        hairline: 'inset 0 -1px 0 #E5E8EB',
        // ── v2 (Phase v3-3 V3-T17에서 제거) ──────────────────────
        flat: '2px 3px 0 rgba(43,34,24,0.18)',
        card: '2px 3px 0 rgba(43,34,24,0.12)',
        pop:  '3px 4px 0 rgba(43,34,24,0.22)',
      },
      borderRadius: {
        // ── v3 Coral ──────────────────────────────────────────────
        '2xs': '4px',
        xs:    '6px',
        // ── v2 유지 ───────────────────────────────────────────────
        screen: '32px',
      },
    },
  },
  plugins: [],
}
