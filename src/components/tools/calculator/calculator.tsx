import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CalculatorDisplay } from "./calculator-display"
import { CalculatorHistory } from "./calculator-history"
import { useCalculator } from "./use-calculator"

export function Calculator() {
  const {
    display,
    history,
    handleNumber,
    handleOperator,
    handleEquals,
    handleClear,
    handleDelete,
  } = useCalculator()

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <CalculatorDisplay value={display} />
        <div className="grid grid-cols-4 gap-2 mt-4">
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleClear()}
          >
            C
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleDelete()}
          >
            ←
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleOperator("%")}
          >
            %
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleOperator("/")}
          >
            ÷
          </Button>
          {[7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="text-lg font-medium"
              onClick={() => handleNumber(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleOperator("*")}
          >
            ×
          </Button>
          {[4, 5, 6].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="text-lg font-medium"
              onClick={() => handleNumber(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleOperator("-")}
          >
            -
          </Button>
          {[1, 2, 3].map((num) => (
            <Button
              key={num}
              variant="outline"
              className="text-lg font-medium"
              onClick={() => handleNumber(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleOperator("+")}
          >
            +
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleNumber("0")}
          >
            0
          </Button>
          <Button
            variant="outline"
            className="text-lg font-medium"
            onClick={() => handleNumber(".")}
          >
            .
          </Button>
          <Button
            variant="primary"
            className="text-lg font-medium col-span-2"
            onClick={() => handleEquals()}
          >
            =
          </Button>
        </div>
      </Card>
      <CalculatorHistory history={history} />
    </div>
  )
}