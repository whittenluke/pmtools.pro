import { Calculator as CalculatorTool } from '@/components/tools/calculator/calculator'

export function Calculator() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Professional Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Advanced calculation modes with history tracking
        </p>
      </div>
      <CalculatorTool />
    </div>
  )
}