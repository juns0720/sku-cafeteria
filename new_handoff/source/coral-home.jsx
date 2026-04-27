// Coral Home — 메인 홈 화면 (독립 버전)
// coral-system.jsx 의 primitives 사용

const CORAL_BEST_DATA = [
{ m: '치킨까스', c: '양식', r: 4.7, n: 24, ill: 'bowl' },
{ m: '제육볶음', c: '한식', r: 4.5, n: 31, ill: 'bowl' },
{ m: '순두부찌개', c: '일품', r: 4.3, n: 18, ill: 'soup' },
{ m: '김치찌개', c: '한식', r: 4.2, n: 15, ill: 'soup' },
{ m: '라볶이', c: '분식', r: 4.0, n: 9, ill: 'bowl' }];


const CORAL_TODAY_DATA = [
{ c: '양식', m: '치킨까스', r: 4.7, n: 24, ill: 'bowl' },
{ c: '한식', m: '김치찌개 정식', r: 4.3, n: 18, ill: 'soup' },
{ c: '일품', m: '순두부찌개', r: 4.1, n: 11, ill: 'soup', nw: true },
{ c: '분식', m: '비빔국수', r: 3.9, n: 7, ill: 'bowl' }];


function CoralHome() {
  const ACC = CORAL.main;
  const ACC_SOFT = CORAL.soft;
  return (
    <CFrame>
      <CStatus />

      {/* Header */}
      <div style={{
        padding: '8px 24px 22px', flexShrink: 0
      }}>
        <div style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>4월 20일 월요일</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.7, marginTop: 4, color: CG.g900 }}>SKU 학식</div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Best */}
        <div style={{
          padding: '0 24px 12px', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.4, color: CG.g900 }}>
            오늘의 베스트 <span style={{ color: ACC }}>5</span>
          </div>
          <span style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>전체</span>
        </div>
        <div style={{ overflow: 'hidden', padding: '0 0 22px', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 12, padding: '0 24px', width: 'max-content' }}>
            {CORAL_BEST_DATA.map((b, i) =>
            <div key={i} style={{ width: 124, flexShrink: 0 }}>
                <div style={{
                width: 124, height: 124, borderRadius: 14,
                background: CG.g100, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <CIcon k={b.ill} size={50} c={CG.g500} w={1.5} />
                  <div style={{
                  position: 'absolute', top: 8, left: 8,
                  background: i === 0 ? ACC : '#fff',
                  color: i === 0 ? '#fff' : CG.g900,
                  fontSize: 11, fontWeight: 800,
                  padding: '2px 8px', borderRadius: 999
                }}>{i + 1}위</div>
                </div>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 8, letterSpacing: -0.2 }}>{b.m}</div>
                <div style={{ fontSize: 12, color: CG.g500, marginTop: 1 }}>{b.c}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 4 }}>
                  <CIcon k="star" size={12} c={ACC} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{b.r}</span>
                  <span style={{ fontSize: 11, color: CG.g500 }}>({b.n})</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today */}
        <div style={{
          padding: '0 24px 6px', flexShrink: 0,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.4 }}>오늘의 메뉴</div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 13, color: CG.g700, fontWeight: 600
          }}>
            별점순 <CIcon k="chevD" size={9} c={CG.g700} />
          </div>
        </div>
        <div style={{ padding: '0 24px', flex: 1, overflow: 'hidden' }}>
          {CORAL_TODAY_DATA.map((r, i) =>
          <div key={i} style={{
            padding: '13px 0',
            display: 'flex', gap: 14, alignItems: 'center'
          }}>
              <div style={{
              width: 50, height: 50, borderRadius: 12, background: CG.g100,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <CIcon k={r.ill} size={24} c={CG.g500} w={1.6} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 12, color: CG.g500, fontWeight: 500 }}>{r.c}</span>
                  {r.nw && <span style={{
                  fontSize: 10, fontWeight: 700, color: ACC,
                  background: ACC_SOFT, padding: '1px 6px', borderRadius: 3
                }}>NEW</span>}
                </div>
                <div style={{ fontSize: 15.5, fontWeight: 700, marginTop: 1, letterSpacing: -0.3 }}>{r.m}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
                  <CIcon k="star" size={12} c={ACC} />
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{r.r}</span>
                </div>
                <div style={{ fontSize: 11, color: CG.g500, marginTop: 2 }}>리뷰 {r.n}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CTab active="home" accent={ACC} />
    </CFrame>);

}

Object.assign(window, { CoralHome });