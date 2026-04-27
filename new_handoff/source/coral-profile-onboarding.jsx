// Coral 화면들 — Profile + Onboarding (Login / Nickname / Empty)

// ════════════════════════════════════════════════
// ⑥ PROFILE — 프로필 (정보 + 진행도 + 통계 + 내 리뷰)
// ════════════════════════════════════════════════
function CoralProfile() {
  const myReviews = [
    { m: '치킨까스', c: '양식', t: 5, d: '4/15', ill: 'bowl' },
    { m: '김치찌개', c: '한식', t: 4, d: '4/12', ill: 'soup' },
    { m: '제육볶음', c: '한식', t: 5, d: '4/10', ill: 'bowl' },
  ];
  return (
    <CFrame>
      <CStatus />
      <div style={{
        padding: '6px 24px 16px', flexShrink: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.6 }}>프로필</div>
        <CIcon k="gear" size={22} c={CG.g700} w={1.7} />
      </div>

      <div style={{ flex: 1, overflow: 'hidden', padding: '0 24px' }}>
        {/* Profile card */}
        <div style={{
          padding: 16, borderRadius: 18, background: CG.g50,
          display: 'flex', gap: 14, alignItems: 'center',
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 30, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, fontWeight: 800, color: CG.g900, letterSpacing: -1,
          }}>밥</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.3 }}>밥상탐험가</span>
              <span style={{ fontSize: 14 }}>🥈</span>
            </div>
            <div style={{ fontSize: 12, color: CG.g600, marginTop: 2, fontWeight: 500 }}>
              작성 리뷰 14개 · 가입 2025.09
            </div>
          </div>
          <CIcon k="chevR" size={14} c={CG.g500} w={1.8} />
        </div>

        {/* Progress */}
        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: CG.g50 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: CG.g700, fontWeight: 600 }}>
              다음 뱃지 <span style={{ color: CG.g900, fontWeight: 800 }}>🥇 대가</span>까지
            </span>
            <span style={{ fontSize: 13, fontWeight: 800, color: CORAL.main }}>16개 남음</span>
          </div>
          <div style={{
            marginTop: 10, height: 8, background: CG.g200,
            borderRadius: 999, overflow: 'hidden',
          }}>
            <div style={{ width: '47%', height: '100%', background: CORAL.main, borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, color: CG.g500, fontWeight: 600 }}>14</span>
            <span style={{ fontSize: 11, color: CG.g500, fontWeight: 600 }}>30</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { n: 14, l: '리뷰' },
            { n: 4.2, l: '평균 별점' },
            { n: 2, l: '뱃지' },
          ].map(s => (
            <div key={s.l} style={{ padding: '14px 8px', textAlign: 'center', background: CG.g50, borderRadius: 14 }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, color: CG.g900 }}>{s.n}</div>
              <div style={{ fontSize: 11, color: CG.g600, marginTop: 2, fontWeight: 600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* My reviews */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.4 }}>내가 쓴 리뷰</span>
            <span style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>전체 14 ›</span>
          </div>
          {myReviews.map((r, i) => (
            <div key={i} style={{ padding: '11px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
              <CThumb ill={r.ill} cat={r.c} size={44} radius={11} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: -0.3 }}>{r.m}</span>
                  <span style={{ fontSize: 11, color: CG.g500 }}>{r.d}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <CStars value={r.t} size={11} c={CORAL.star} />
                  <span style={{ fontSize: 11, color: CG.g500, marginLeft: 2 }}>{r.c}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CTab active="me" />
    </CFrame>
  );
}

// ════════════════════════════════════════════════
// ⑦-1 LOGIN — Google OAuth
// ════════════════════════════════════════════════
function CoralLogin() {
  return (
    <CFrame bg={CG.white}>
      <CStatus />
      <div style={{
        flex: 1, padding: '60px 28px 28px', flexShrink: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          width: 96, height: 96, borderRadius: 28, background: CORAL.soft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CIcon k="bowl" size={56} c={CORAL.main} w={2} />
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -0.9, marginTop: 28, color: CG.g900 }}>
          SKU 학식
        </div>
        <div style={{ fontSize: 15, color: CG.g600, marginTop: 8, textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
          오늘 뭐 먹을지,<br />
          친구들 평점으로 3초 안에 결정해요
        </div>

        <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
          {[
            { k: 'soup', bg: '#FFF1ED', c: '#E5766C' },
            { k: 'bowl', bg: '#FFF5E0', c: '#E29A38' },
            { k: 'chop', bg: '#EAF6EE', c: '#5A9C6E' },
          ].map((it, i) => (
            <div key={i} style={{
              width: 52, height: 52, borderRadius: 14,
              background: it.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CIcon k={it.k} size={26} c={it.c} w={1.7} />
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        <button style={{
          width: '100%', padding: '16px 20px', borderRadius: 14,
          background: CG.g900, color: '#fff',
          border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 700, letterSpacing: -0.3,
          fontFamily: CORAL_FONT,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.91-2.26c-.81.54-1.83.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33A9 9 0 009 18z" fill="#34A853"/>
            <path d="M3.95 10.71A5.41 5.41 0 013.66 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l2.99-2.33z" fill="#FBBC05"/>
            <path d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96L3.95 7.3C4.66 5.16 6.65 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Google로 시작하기
        </button>
        <div style={{ fontSize: 11, color: CG.g500, marginTop: 14, textAlign: 'center', lineHeight: 1.4 }}>
          시작하면 이용약관·개인정보 처리방침에 동의합니다
        </div>
      </div>
    </CFrame>
  );
}

// ════════════════════════════════════════════════
// ⑦-2 NICKNAME — 닉네임 설정
// ════════════════════════════════════════════════
function CoralNickname() {
  return (
    <CFrame>
      <CStatus />
      <div style={{ padding: '8px 16px', flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CIcon k="chevL" size={20} c={CG.g900} w={2} />
        </div>
      </div>

      <div style={{ padding: '14px 24px', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 12, color: CG.g500, fontWeight: 600 }}>2 / 2 · 마지막 단계</div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.7, color: CG.g900, marginTop: 6, lineHeight: 1.3 }}>
          리뷰에 쓸<br />
          <span style={{ color: CORAL.main }}>닉네임</span>을 정해주세요
        </div>

        {/* Input */}
        <div style={{
          marginTop: 28, padding: '16px 14px',
          background: CG.g50, borderRadius: 14,
          border: `2px solid ${CORAL.main}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: CG.g900, letterSpacing: -0.3 }}>밥상탐험가</span>
            <span style={{ width: 2, height: 22, background: CORAL.main, marginLeft: 3 }} />
            <span style={{
              marginLeft: 'auto', fontSize: 12, color: '#22A06B', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: 3,
            }}>
              <CIcon k="check" size={13} c="#22A06B" w={2.4} /> 사용 가능
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 4px' }}>
          <span style={{ fontSize: 11, color: CG.g500 }}>2~12자 · 한 번 정하면 변경이 어려워요</span>
          <span style={{ fontSize: 11, color: CG.g700, fontWeight: 600 }}>5 / 12</span>
        </div>

        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 12, color: CG.g600, fontWeight: 700, marginBottom: 10 }}>
            추천 닉네임
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['냠냠이', '점심탐정', '학식러버', '오늘은한식', '돈까스킬러'].map(n => (
              <div key={n} style={{
                padding: '8px 14px', background: CG.g50,
                borderRadius: 999, fontSize: 13, fontWeight: 600,
                color: CG.g700, letterSpacing: -0.2,
              }}>{n}</div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 18px', flexShrink: 0 }}>
        <CButton primary size="lg" style={{ width: '100%' }}
          icon={<CIcon k="arrow" size={16} c="#fff" w={2} />}>
          시작하기
        </CButton>
      </div>
    </CFrame>
  );
}

// ════════════════════════════════════════════════
// ⑦-3 EMPTY — 빈 상태
// ════════════════════════════════════════════════
function CoralEmpty() {
  const last = [
    { m: '치킨까스', c: '양식', r: 4.7, ill: 'bowl' },
    { m: '제육볶음', c: '한식', r: 4.5, ill: 'bowl' },
  ];
  return (
    <CFrame>
      <CStatus />
      <div style={{ padding: '6px 24px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 13, color: CG.g600, fontWeight: 600 }}>4월 20일 월요일</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.7, color: CG.g900, marginTop: 4 }}>SKU 학식</div>
      </div>

      <div style={{
        flex: 1, overflow: 'hidden', padding: '0 24px',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Empty hero */}
        <div style={{
          padding: '36px 20px', borderRadius: 20, background: CG.g50,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CIcon k="soup" size={36} c={CG.g400} w={1.6} />
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: CG.g900, marginTop: 16, letterSpacing: -0.4 }}>
            아직 오늘 메뉴가 없어요
          </div>
          <div style={{ fontSize: 13, color: CG.g600, marginTop: 6, lineHeight: 1.5 }}>
            매주 월요일 아침에 업데이트됩니다.<br />조금만 기다려주세요!
          </div>
        </div>

        {/* Last week preview */}
        <div style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: CG.g700, marginBottom: 12, letterSpacing: -0.3 }}>
            지난 주 베스트 미리보기
          </div>
          {last.map((r, i) => (
            <div key={i} style={{
              padding: '12px 0', display: 'flex', gap: 12, alignItems: 'center',
              opacity: 0.85,
            }}>
              <CThumb ill={r.ill} cat={r.c} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: CG.g500, fontWeight: 500 }}>{r.c}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginTop: 1, letterSpacing: -0.3 }}>{r.m}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <CIcon k="star" size={12} c={CORAL.star} />
                <span style={{ fontSize: 14, fontWeight: 700 }}>{r.r}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CTab active="home" />
    </CFrame>
  );
}

Object.assign(window, { CoralProfile, CoralLogin, CoralNickname, CoralEmpty });
