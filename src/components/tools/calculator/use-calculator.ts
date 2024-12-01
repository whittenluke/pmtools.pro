import { useState } from "react"

export function useCalculator() {
  const [display, setDisplay] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [lastNumber, setLastNumber] = useState("")
  const [operator, setOperator] = useState("")
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num)
      setShouldResetDisplay(false)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    if (display) {
      setLastNumber(display)
      setOperator(op)
      setShouldResetDisplay(true)
    }
  }

  const handleEquals = () => {
    if (!display || !lastNumber || !operator) return

    const num1 = parseFloat(lastNumber)
    const num2 = parseFloat(display)
    let result = 0

    switch (operator) {
      case "+":
        result = num1 + num2
        break
      case "-":
        result = num1 - num2
        break
      case "*":
        result = num1 * num2
        break
      case "/":
        result = num1 / num2
        break
      case "%":
        result = (num1 * num2) / 100
        break
    }

    const calculation = `${lastNumber} ${operator} ${display} = ${result}`
    setHistory([calculation, ...history])
    setDisplay(result.toString())
    setLastNumber("")
    setOperator("")
    setShouldResetDisplay(true)
  }

  const handleClear = () => {
    setDisplay("")
    setLastNumber("")
    setOperator("")
  }

  const handleDelete = () => {
    setDisplay(display.slice(0, -1))
  }

  return {
    display,
    history,
    handleNumber,
    handleOperator,
    handleEquals,
    handleClear,
    handleDelete,
  }
}