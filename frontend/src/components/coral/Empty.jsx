// 빈 상태 컴포넌트 — 모든 페이지 0건 분기에서 사용
// 일러스트 아이콘이 rotate(-6deg → 0deg) 800ms ease-out 으로 진입
import Icon from './Icon';

export default function Empty({ icon = 'soup', title, description, cta }) {
  return (
    <>
      <style>{`
        @keyframes rotateIn {
          from { transform: rotate(-6deg); opacity: 0; }
          to   { transform: rotate(0deg); opacity: 1; }
        }
      `}</style>
      <div className="flex flex-col items-center text-center px-5 py-9 rounded-[20px] bg-g50">
        <div
          className="w-[72px] h-[72px] rounded-[20px] bg-white flex items-center justify-center"
          style={{ animation: 'rotateIn 0.8s ease-out' }}
        >
          <Icon name={icon} size={36} color="#B0B8C1" weight={1.6} />
        </div>
        <div className="text-[17px] font-extrabold text-g900 mt-4 tracking-[-0.4px]">{title}</div>
        {description && (
          <div className="text-[13px] text-g600 mt-1.5 leading-relaxed whitespace-pre-line">
            {description}
          </div>
        )}
        {cta && (
          <button onClick={cta.onClick} className="mt-4 text-[13px] font-semibold text-coral">
            {cta.label}
          </button>
        )}
      </div>
    </>
  );
}
