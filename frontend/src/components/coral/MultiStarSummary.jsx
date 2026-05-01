// 리뷰 카드 한 줄 3축 요약 ("맛 5  양 4  가성비 5") — MenuDetailPage 리뷰 카드
export default function MultiStarSummary({ taste, amount, value }) {
  return (
    <div className="flex gap-2.5">
      {[['맛', taste], ['양', amount], ['가성비', value]].map(([label, val]) => (
        <span key={label} className="text-[12px] text-g600">
          {label} <strong className="text-g900 font-extrabold">{val}</strong>
        </span>
      ))}
    </div>
  );
}
