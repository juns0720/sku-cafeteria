import SkeletonCard from '../components/SkeletonCard'

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-500">SkeletonCard 검증</p>
      <div className="grid grid-cols-2 gap-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
