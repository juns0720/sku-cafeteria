import Icon from '../components/hi/Icon';
import FoodIllust from '../components/hi/FoodIllust';
import Pill from '../components/hi/Pill';
import Card from '../components/hi/Card';
import Button from '../components/hi/Button';
import Stars from '../components/hi/Stars';
import UL from '../components/hi/UL';
import SecLabel from '../components/hi/SecLabel';
import AxisBar from '../components/hi/AxisBar';
import Screen from '../components/hi/Screen';

const ICON_NAMES = [
  'bowl','soup','chop','star','starO','search','home','cal','list',
  'user','heart','gear','pencil','cam','medal','fire','chevL','chevR','chevD',
  'x','plus','filter',
];

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 20,
        color: '#2B2218',
        borderBottom: '2px solid #2B2218',
        paddingBottom: 8,
        marginBottom: 20,
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
        {children}
      </div>
    </section>
  );
}

function Label({ text }) {
  return (
    <div style={{ fontFamily: 'var(--font-hand)', fontSize: 11, color: '#8E7A66', marginTop: 4, textAlign: 'center' }}>
      {text}
    </div>
  );
}

export default function DevComponentsPage() {
  return (
    <div style={{
      background: '#FBF6EC',
      minHeight: '100vh',
      padding: '60px 40px',
      fontFamily: 'var(--font-hand)',
      color: '#2B2218',
    }}>
      <h1 style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 30,
        marginBottom: 8,
      }}>
        <UL>컴포넌트 카탈로그</UL>
      </h1>
      <p style={{ color: '#8E7A66', marginBottom: 48, fontSize: 13 }}>
        components/hi/ · Phase 3 기초 9종
      </p>

      {/* Icon */}
      <Section title="Icon (22종)">
        {ICON_NAMES.map(name => (
          <div key={name} style={{ textAlign: 'center' }}>
            <Icon name={name} size={28} color="#2B2218" />
            <Label text={name} />
          </div>
        ))}
      </Section>

      {/* FoodIllust */}
      <Section title="FoodIllust">
        {[
          { kind: 'bowl', bg: '#FCE3C9' },
          { kind: 'soup', bg: '#FBE6A6' },
          { kind: 'chop', bg: '#CDE5C8' },
          { kind: 'bowl', bg: '#F6C7A8' },
        ].map((p, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <FoodIllust kind={p.kind} size={72} bg={p.bg} />
            <Label text={`${p.kind} · ${p.bg}`} />
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <FoodIllust kind="bowl" size={48} />
          <Label text="size 48" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <FoodIllust kind="soup" size={100} bg="#CDE5C8" />
          <Label text="size 100" />
        </div>
      </Section>

      {/* Pill */}
      <Section title="Pill">
        <div>
          <Pill>기본</Pill>
          <Label text="default" />
        </div>
        <div>
          <Pill bg="#FBE6A6" border="#2B2218">NEW</Pill>
          <Label text="NEW" />
        </div>
        <div>
          <Pill bg="#CDE5C8" border="#4A8F5B" color="#4A8F5B">베스트</Pill>
          <Label text="베스트" />
        </div>
        <div>
          <Pill bg="#FBE6A6" icon={<Icon name="fire" size={12} color="#EF8A3D" />}>TOP 5</Pill>
          <Label text="TOP5 + icon" />
        </div>
        <div>
          <Pill bg="#2B2218" color="#FBF6EC" border="#2B2218">GOLD</Pill>
          <Label text="dark" />
        </div>
      </Section>

      {/* Card */}
      <Section title="Card">
        <Card style={{ padding: 16, width: 140 }}>
          <div style={{ fontFamily: 'var(--font-disp)' }}>기본 카드</div>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>bg white</div>
        </Card>
        <Card style={{ padding: 16, width: 140 }} bg="#FBE6A6">
          <div style={{ fontFamily: 'var(--font-disp)' }}>노랑 배경</div>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>bg yellowSoft</div>
        </Card>
        <Card style={{ padding: 16, width: 140 }} shadow={false}>
          <div style={{ fontFamily: 'var(--font-disp)' }}>그림자 없음</div>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>shadow=false</div>
        </Card>
        <Card style={{ padding: 16, width: 140 }} round={32}>
          <div style={{ fontFamily: 'var(--font-disp)' }}>큰 라운드</div>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>round=32</div>
        </Card>
      </Section>

      {/* Button */}
      <Section title="Button">
        <div style={{ textAlign: 'center' }}>
          <Button>기본</Button>
          <Label text="default md" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button primary>확인</Button>
          <Label text="primary md" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button size="sm">작게</Button>
          <Label text="default sm" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button size="lg" primary>크게</Button>
          <Label text="primary lg" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button icon={<Icon name="pencil" size={16} color="#2B2218" />}>리뷰 쓰기</Button>
          <Label text="with icon" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button primary icon={<Icon name="plus" size={16} color="#FBF6EC" />}>추가</Button>
          <Label text="primary + icon" />
        </div>
      </Section>

      {/* Stars */}
      <Section title="Stars">
        {[0, 1, 2.5, 3, 4.3, 5].map(v => (
          <div key={v} style={{ textAlign: 'center' }}>
            <Stars value={v} size="md" />
            <Label text={`${v} / sm`} />
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <Stars value={4} size="sm" />
          <Label text="size sm (10)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Stars value={4} size="lg" />
          <Label text="size lg (32)" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Stars value={3} size={20} color="#EF8A3D" />
          <Label text="orange, size 20" />
        </div>
      </Section>

      {/* UL */}
      <Section title="UL (웨이브 언더라인)">
        <div>
          <span style={{ fontFamily: 'var(--font-disp)', fontSize: 24 }}>
            <UL>오늘의 메뉴</UL>
          </span>
          <Label text="orange (default)" />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-disp)', fontSize: 20 }}>
            <UL color="#4A8F5B">베스트 메뉴</UL>
          </span>
          <Label text="green" />
        </div>
        <div>
          <span style={{ fontFamily: 'var(--font-disp)', fontSize: 18 }}>
            <UL color="#F4B73B">이번 주</UL>
          </span>
          <Label text="yellow" />
        </div>
      </Section>

      {/* SecLabel */}
      <Section title="SecLabel">
        <div style={{ width: 320, background: '#FBF6EC', padding: 16, border: '1px dashed #D8CBB6' }}>
          <SecLabel>오늘의 베스트</SecLabel>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>right 없음</div>
        </div>
        <div style={{ width: 320, background: '#FBF6EC', padding: 16, border: '1px dashed #D8CBB6' }}>
          <SecLabel right={<Pill bg="#FBE6A6" icon={<Icon name="fire" size={12} color="#EF8A3D" />}>TOP 5</Pill>}>
            이번 주 베스트
          </SecLabel>
          <div style={{ fontSize: 13, color: '#8E7A66' }}>right=Pill</div>
        </div>
      </Section>

      {/* AxisBar */}
      <Section title="AxisBar">
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AxisBar label="맛" value={4.5} color="#EF8A3D" />
          <AxisBar label="양" value={3.2} color="#F4B73B" />
          <AxisBar label="가성비" value={4.8} color="#4A8F5B" />
        </div>
        <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <AxisBar label="맛" value={1.0} />
          <AxisBar label="양" value={5.0} />
          <AxisBar label="가성비" value={2.5} />
        </div>
      </Section>

      {/* Screen */}
      <Section title="Screen (모바일 프레임)">
        <Screen label="프리뷰" sub="375 × 760">
          <div style={{ padding: 20 }}>
            <div style={{ fontFamily: 'var(--font-disp)', fontSize: 22, marginBottom: 8 }}>
              <UL>학식 오늘</UL>
            </div>
            <FoodIllust kind="bowl" size={80} />
            <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Pill>한식</Pill>
              <Pill bg="#FBE6A6">NEW</Pill>
            </div>
            <div style={{ marginTop: 12 }}>
              <Stars value={4.3} size="md" />
            </div>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AxisBar label="맛" value={4.5} />
              <AxisBar label="양" value={3.8} />
              <AxisBar label="가성비" value={4.2} />
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <Button size="sm">취소</Button>
              <Button size="sm" primary>리뷰 쓰기</Button>
            </div>
          </div>
        </Screen>
      </Section>
    </div>
  );
}
