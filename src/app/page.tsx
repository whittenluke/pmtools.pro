import { ToolGrid } from '@/components/tool-grid'
import { Hero } from '@/components/hero'

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <ToolGrid />
    </div>
  )
}