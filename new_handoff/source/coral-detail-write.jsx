// Coral 화면들 — Detail (메뉴 상세) + Write (리뷰 작성)

// ════════════════════════════════════════════════
// ④ DETAIL — 메뉴 상세 (Hero + 3축 + 리뷰 리스트)
// ════════════════════════════════════════════════
function CoralDetail() {
  const reviews = [
  { u: '밥상탐험가', b: '🥇', d: '4월 15일', taste: 5, amt: 5, val: 5,
    text: '바삭함이 살아있고 소스도 적당해요. 양도 충분합니다!' },
  { u: '익명의고양이', b: '🥈', d: '4월 13일', taste: 4, amt: 4, val: 5,
    text: '가성비 최고. 분식보다 훨씬 나아요.' }];

  return (
    <CFrame>
      <CStatus />
      {/* Top bar */}
      <div style={{
        padding: '8px 16px', flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: CG.g50,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CIcon k="chevL" size={18} c={CG.g900} w={2} />
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 18, background: CG.g50,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CIcon k="heart" size={18} c={CG.g700} w={1.7} />
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: '4px 24px 18px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 140, height: 140, borderRadius: 24,
          background: CG.g100,
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        }}>
          <CIcon k="bowl" size={70} c={CG.g500} w={1.5} />
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: CORAL.main, color: '#fff',
            padding: '3px 9px', borderRadius: 999,
            fontSize: 11, fontWeight: 800
          }}>BEST</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 13, color: CG.g500, fontWeight: 500 }}>양식 · 2026. 4. 20</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.7, color: CG.g900, marginTop: 2 }}>치킨까스</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <CStars value={5} size={16} c={CORAL.star} />
          <span style={{ fontSize: 17, fontWeight: 800, color: CG.g900 }}>4.7</span>
          <span style={{ fontSize: 13, color: CG.g500 }}>· 리뷰 24개</span>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px' }}>
        {/* 3축 */}
        <div style={{
          padding: 16, borderRadius: 16, background: CG.g50,
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8
        }}>
          {[
          { l: '맛', v: 4.8 },
          { l: '양', v: 4.5 },
          { l: '가성비', v: 4.6 }].
          map((a) =>
          <div key={a.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: CG.g600, fontWeight: 600 }}>{a.l}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: CG.g900, marginTop: 2, letterSpacing: -0.5 }}>{a.v}</div>
              <div style={{
              height: 4, background: CG.g200, borderRadius: 999, marginTop: 6, overflow: 'hidden'
            }}>
                <div style={{ width: `${a.v / 5 * 100}%`, height: '100%', background: CORAL.main, borderRadius: 999 }} />
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div style={{ marginTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4 }}>리뷰 24</span>
            <span style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>최신순</span>
          </div>
          {reviews.map((r, i) =>
          <div key={i} style={{
            padding: '14px 0',
            borderTop: i === 0 ? `1px solid ${CG.g100}` : 'none',
            borderBottom: `1px solid ${CG.g100}`
          }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: CG.g900 }}>{r.u}</span>
                  <span style={{ fontSize: 14 }}>{r.b}</span>
                </div>
                <span style={{ fontSize: 12, color: CG.g500 }}>{r.d}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                {[['맛', r.taste], ['양', r.amt], ['가성비', r.val]].map(([l, v]) =>
              <span key={l} style={{ fontSize: 12, color: CG.g600 }}>
                    {l} <b style={{ color: CG.g900, fontWeight: 800 }}>{v}</b>
                  </span>
              )}
              </div>
              <div style={{ fontSize: 14, color: CG.g800, marginTop: 8, lineHeight: 1.5 }}>{r.text}</div>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '12px 24px 18px', flexShrink: 0 }}>
        <CButton primary size="lg" style={{ width: '100%' }}
        icon={<CIcon k="pencil" size={16} c="#fff" w={2} />}>
          리뷰 작성하기
        </CButton>
      </div>
    </CFrame>);

}

// ════════════════════════════════════════════════
// ⑤ WRITE — 리뷰 작성 (3축 5점 + 코멘트)
// ════════════════════════════════════════════════
function CoralWrite() {
  const axes = [
  { l: '맛', sub: '얼마나 맛있었나요?', v: 5 },
  { l: '양', sub: '양은 충분했나요?', v: 4 },
  { l: '가성비', sub: '값어치 했나요?', v: 5 }];

  return (
    <CFrame>
      <CStatus />
      {/* Header */}
      <div style={{
        padding: '8px 16px 14px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <CIcon k="x" size={20} c={CG.g900} w={2} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>리뷰 쓰기</div>
        <span style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>임시저장</span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px' }}>
        {/* Menu card */}
        <div style={{
          padding: 14, borderRadius: 16, background: CG.g50,
          display: 'flex', gap: 12, alignItems: 'center'
        }}>
          <CThumb ill="bowl" cat="양식" size={52} />
          <div>
            <div style={{ fontSize: 12, color: CG.g500, fontWeight: 500 }}>양식 · 2026. 4. 20</div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>치킨까스</div>
          </div>
        </div>

        {/* 3 axes */}
        {axes.map((a) =>
        <div key={a.l} style={{ marginTop: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 17, fontWeight: 800, color: CG.g900, letterSpacing: -0.3 }}>{a.l}</span>
                <span style={{ fontSize: 12, color: CG.g500, marginLeft: 8 }}>{a.sub}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 800, color: CORAL.main }}>{a.v}.0</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {Array.from({ length: 5 }).map((_, i) =>
            <CIcon key={i} k={i < a.v ? 'star' : 'starO'} size={32}
            c={i < a.v ? CORAL.main : CG.g300} w={1.6} />
            )}
            </div>
          </div>
        )}

        {/* Comment */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>한 마디</span>
            <span style={{ fontSize: 12, color: CG.g500, marginLeft: 8 }}>(선택)</span>
          </div>
          <div style={{
            marginTop: 10, padding: 14, minHeight: 64,
            background: CG.g50, borderRadius: 14,
            fontSize: 14, color: CG.g800, lineHeight: 1.5
          }}>
            바삭함이 살아있어요! 양도 충분하고...
            <span style={{ borderLeft: `2px solid ${CORAL.main}`, marginLeft: 2, height: 16, display: 'inline-block', verticalAlign: 'middle' }} />
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 10 }}>
            <CIcon k="cam" size={16} c={CG.g600} w={1.7} />
            <span style={{ fontSize: 12, color: CG.g600, fontWeight: 600 }}>사진 첨부 (선택)</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 18px', flexShrink: 0 }}>
        <CButton primary size="lg" style={{ width: '100%' }}>리뷰 등록</CButton>
      </div>
    </CFrame>);

}

Object.assign(window, { CoralDetail, CoralWrite });