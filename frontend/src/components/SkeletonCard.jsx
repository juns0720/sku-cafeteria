export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-surface">
      {/* 이미지 영역 — aspect-ratio 4:3 */}
      <div className="w-full aspect-[4/3] shimmer-bg" />

      {/* 텍스트 영역 */}
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded shimmer-bg" />
        <div className="h-3 w-1/2 rounded shimmer-bg" />
      </div>
    </div>
  )
}
