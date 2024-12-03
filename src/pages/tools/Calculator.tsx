import React, { useState } from 'react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevNumber, setPrevNumber] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperator = (op: string) => {
    setOperator(op);
    setPrevNumber(display);
    setNewNumber(true);
    setEquation(`${display} ${op}`);
  };

  const calculate = () => {
    if (!prevNumber || !operator) return;
    
    const prev = parseFloat(prevNumber);
    const current = parseFloat(display);
    let result = 0;

    switch (operator) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
    }

    setDisplay(result.toString());
    setEquation('');
    setPrevNumber(null);
    setOperator(null);
    setNewNumber(true);
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setPrevNumber(null);
    setOperator(null);
    setNewNumber(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <div className="text-gray-500 text-sm h-6">{equation}</div>
          <div className="text-3xl font-bold text-right">{display}</div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <button onClick={clear} className="col-span-2 bg-red-500 text-white p-4 rounded hover:bg-red-600">
            Clear
          </button>
          <button onClick={() => handleOperator('÷')} className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600">
            ÷
          </button>
          <button onClick={() => handleOperator('×')} className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600">
            ×
          </button>
          
          {[7, 8, 9].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-200 p-4 rounded hover:bg-gray-300"
            >
              {num}
            </button>
          ))}
          <button onClick={() => handleOperator('-')} className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600">
            -
          </button>
          
          {[4, 5, 6].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-200 p-4 rounded hover:bg-gray-300"
            >
              {num}
            </button>
          ))}
          <button onClick={() => handleOperator('+')} className="bg-indigo-500 text-white p-4 rounded hover:bg-indigo-600">
            +
          </button>
          
          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => handleNumber(num.toString())}
              className="bg-gray-200 p-4 rounded hover:bg-gray-300"
            >
              {num}
            </button>
          ))}
          <button onClick={calculate} className="bg-green-500 text-white p-4 rounded hover:bg-green-600">
            =
          </button>
          
          <button
            onClick={() => handleNumber('0')}
            className="col-span-2 bg-gray-200 p-4 rounded hover:bg-gray-300"
          >
            0
          </button>
          <button
            onClick={() => handleNumber('.')}
            className="bg-gray-200 p-4 rounded hover:bg-gray-300"
          >
            .
          </button>
        </div>
      </div>
    </div>
  );
} 