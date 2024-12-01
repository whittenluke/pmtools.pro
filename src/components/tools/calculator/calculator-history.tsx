import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalculatorHistoryProps {
  history: string[]
}

export function CalculatorHistory({ history }: CalculatorHistoryProps) {
  if (history.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {history.map((entry, index) => (
              <div
                key={index}
                className="p-2 rounded-md bg-secondary text-right font-mono"
              >
                {entry}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}