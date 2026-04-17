import StarDisplay from '../components/StarDisplay'

export default function HomePage() {
  return (
    <div className="p-4 space-y-4">
      <p className="text-sm text-gray-500">StarDisplay 검증</p>
      <div className="flex items-center gap-2">
        <StarDisplay rating={0} size="md" />
        <span className="text-sm">0</span>
      </div>
      <div className="flex items-center gap-2">
        <StarDisplay rating={2.5} size="md" />
        <span className="text-sm">2.5</span>
      </div>
      <div className="flex items-center gap-2">
        <StarDisplay rating={3.5} size="md" />
        <span className="text-sm">3.5</span>
      </div>
      <div className="flex items-center gap-2">
        <StarDisplay rating={5} size="md" />
        <span className="text-sm">5</span>
      </div>
      <div className="flex items-center gap-2">
        <StarDisplay rating={3.5} size="sm" />
        <span className="text-sm">sm</span>
      </div>
      <div className="flex items-center gap-2">
        <StarDisplay rating={3.5} size="lg" />
        <span className="text-sm">lg</span>
      </div>
    </div>
  )
}
