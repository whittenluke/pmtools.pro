import { Calculator } from "@/components/tools/calculator/calculator"

export const metadata = {
  title: "Calculator | PMTools.pro",
  description: "Advanced calculator with history tracking and shareable results",
}

export default function CalculatorPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Professional Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Advanced calculation modes with history tracking
        </p>
      </div>
      <Calculator />
    </div>
  )
}