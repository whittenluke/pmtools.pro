import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const tools = [
  {
    slug: 'calculator',
    name: 'Calculator',
    description: 'Advanced calculation modes with history tracking and shareable results.',
  },
  {
    slug: 'time-tracker',
    name: 'Time Tracker',
    description: 'Track time with Pomodoro technique integration and project-based logging.',
  },
  {
    slug: 'estimation',
    name: 'Project Estimation',
    description: 'Accurate project estimations with risk factor calculations and templates.',
  },
]

export function ToolGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tools.map((tool) => (
        <Link key={tool.slug} href={`/tools/${tool.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{tool.name}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}