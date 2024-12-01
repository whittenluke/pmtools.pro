import { Card } from "@/components/ui/card"

interface CalculatorDisplayProps {
  value: string
}

export function CalculatorDisplay({ value }: CalculatorDisplayProps) {
  return (
    <Card className="p-4 mb-4 bg-secondary">
      <div className="text-right text-3xl font-mono truncate">{value || "0"}</div>
    </Card>
  )
}