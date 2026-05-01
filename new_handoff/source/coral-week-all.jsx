// Coral 화면들 — Week (주간) + All (전체 메뉴)

// ════════════════════════════════════════════════
// ② WEEK — 주간 식단 (월~금 가로 day picker + 카테고리 그룹)
// ════════════════════════════════════════════════
function CoralWeek() {
  const days = [
    { d: '월', n: 20, active: true },
    { d: '화', n: 21 },
    { d: '수', n: 22 },
    { d: '목', n: 23 },
    { d: '금', n: 24 },
  ];
  const groups = [
    { c: '한식', items: [
      { m: '김치찌개 정식', r: 4.3, n: 18, ill: 'soup' },
      { m: '제육볶음', r: 4.5, n: 31, ill: 'bowl' },
    ]},
    { c: '양식', items: [
      { m: '치킨까스', r: 4.7, n: 24, ill: 'bowl' },
      { m: '바질 크림 파스타', r: null, n: 0, ill: 'bowl', nw: true },
    ]},
    { c: '일품', items: [
      { m: '순두부찌개', r: 4.1, n: 11, ill: 'soup', nw: true },
    ]},
    { c: '분식', items: [
      { m: '비빔국수', r: 3.9, n: 7, ill: 'bowl' },
    ]},
  ];

  return (
    <CFrame>
      <CStatus />
      <div style={{ padding: '6px 24px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, color: CG.g900 }}>주간 식단</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: CG.g700, fontWeight: 600 }}>
            4월 3주차 <CIcon k="chevD" size={9} c={CG.g700} />
          </div>
        </div>
      </div>

      {/* 요일 picker */}
      <div style={{ padding: '0 18px 18px', flexShrink: 0, display: 'flex', gap: 6 }}>
        {days.map(d => (
          <div key={d.d} style={{
            flex: 1, padding: '12px 0', borderRadius: 16,
            background: d.active ? CG.g900 : CG.g50,
            color: d.active ? '#fff' : CG.g600,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}>{d.d}</div>
            <div style={{ fontSize: 19, fontWeight: 800, marginTop: 2, letterSpacing: -0.3 }}>{d.n}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px' }}>
        {groups.map((g, gi) => (
          <div key={g.c} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: CG.g900, letterSpacing: -0.3 }}>{g.c}</span>
              <span style={{ fontSize: 12, color: CG.g500 }}>{g.items.length}</span>
            </div>
            {g.items.map((r, i) => (
              <div key={i} style={{ padding: '10px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
                <CThumb ill={r.ill} cat={g.c} size={48} radius={12} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: CG.g900, letterSpacing: -0.3 }}>{r.m}</span>
                    {r.nw && <span style={{
                      fontSize: 10, fontWeight: 700, color: CORAL.main, background: CORAL.soft,
                      padding: '2px 6px', borderRadius: 4,
                    }}>NEW</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    {r.r ? (
                      <>
                        <CIcon k="star" size={11} c={CORAL.star} />
                        <span style={{ fontSize: 12.5, fontWeight: 700 }}>{r.r}</span>
                        <span style={{ fontSize: 11, color: CG.g500 }}>· 리뷰 {r.n}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: CG.g500, fontWeight: 500 }}>리뷰를 남겨주세요</span>
                    )}
                  </div>
                </div>
                <CIcon k="chevR" size={12} c={CG.g400} w={1.8} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <CTab active="week" />
    </CFrame>
  );
}

// ════════════════════════════════════════════════
// ③ ALL — 전체 메뉴 (검색 + 카테고리 칩 + 정렬)
// ════════════════════════════════════════════════
function CoralAll() {
  const cats = ['전체', '한식', '양식', '일품', '분식', '중식'];
  const items = [
    { m: '치킨까스', c: '양식', r: 4.7, n: 24, ill: 'bowl', best: true },
    { m: '제육볶음', c: '한식', r: 4.5, n: 31, ill: 'bowl' },
    { m: '순두부찌개', c: '일품', r: 4.3, n: 18, ill: 'soup' },
    { m: '김치찌개', c: '한식', r: 4.2, n: 15, ill: 'soup' },
    { m: '비빔국수', c: '분식', r: 3.9, n: 7, ill: 'bowl' },
    { m: '미트볼 스파게티', c: '양식', r: 4.0, n: 12, ill: 'bowl' },
    { m: '마파두부', c: '중식', r: 4.1, n: 9, ill: 'bowl' },
  ];
  return (
    <CFrame>
      <CStatus />
      <div style={{ padding: '6px 24px 14px', flexShrink: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6, color: CG.g900 }}>전체 메뉴</div>
      </div>

      {/* Search */}
      <div style={{ padding: '0 24px 14px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '12px 14px', borderRadius: 12, background: CG.g50,
        }}>
          <CIcon k="search" size={18} c={CG.g500} w={1.8} />
          <span style={{ fontSize: 14, color: CG.g500, fontWeight: 500 }}>메뉴 검색</span>
        </div>
      </div>

      {/* Chips */}
      <div style={{ padding: '0 0 16px', flexShrink: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 6, padding: '0 24px', width: 'max-content' }}>
          {cats.map((c, i) => (
            <CChip key={c} active={i === 0}>{c}</CChip>
          ))}
        </div>
      </div>

      {/* Sort row */}
      <div style={{
        padding: '0 24px 8px', flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>총 {items.length}개</span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: CG.g700, fontWeight: 600 }}>
          별점 높은순 <CIcon k="chevD" size={9} c={CG.g700} />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px' }}>
        {items.map((r, i) => (
          <div key={i} style={{ padding: '13px 0', display: 'flex', gap: 14, alignItems: 'center' }}>
            <CThumb ill={r.ill} cat={r.c} size={52} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12.5, color: CG.g500, fontWeight: 500 }}>{r.c}</span>
                {r.best && <span style={{
                  fontSize: 10, fontWeight: 800, color: '#fff', background: CORAL.main,
                  padding: '2px 6px', borderRadius: 4,
                }}>BEST</span>}
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, marginTop: 1, letterSpacing: -0.3 }}>{r.m}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                <CIcon k="star" size={12} c={CORAL.star} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>{r.r}</span>
              </div>
              <div style={{ fontSize: 11, color: CG.g500, marginTop: 2 }}>리뷰 {r.n}</div>
            </div>
          </div>
        ))}
      </div>

      <CTab active="all" />
    </CFrame>
  );
}

Object.assign(window, { CoralWeek, CoralAll });
