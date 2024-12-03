import { useState } from 'react';
import { Plus, Copy, RotateCcw, Trash2 } from 'lucide-react';

interface Criterion {
  id: string;
  name: string;
  weight: number;
}

interface Option {
  id: string;
  name: string;
  scores: Record<string, number>; // criterionId: score
}

interface Matrix {
  title: string;
  criteria: Criterion[];
  options: Option[];
}

export function DecisionMatrix() {
  const [matrix, setMatrix] = useState<Matrix>({
    title: '',
    criteria: [],
    options: []
  });

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: crypto.randomUUID(),
      name: '',
      weight: 1
    };
    setMatrix({
      ...matrix,
      criteria: [...matrix.criteria, newCriterion]
    });
  };

  const addOption = () => {
    const newOption: Option = {
      id: crypto.randomUUID(),
      name: '',
      scores: matrix.criteria.reduce((acc, criterion) => ({
        ...acc,
        [criterion.id]: 0
      }), {})
    };
    setMatrix({
      ...matrix,
      options: [...matrix.options, newOption]
    });
  };

  const updateScore = (optionId: string, criterionId: string, score: number) => {
    setMatrix({
      ...matrix,
      options: matrix.options.map(option =>
        option.id === optionId
          ? {
              ...option,
              scores: { ...option.scores, [criterionId]: score }
            }
          : option
      )
    });
  };

  const calculateTotalScore = (option: Option): number => {
    return matrix.criteria.reduce((total, criterion) => {
      return total + (option.scores[criterion.id] * criterion.weight);
    }, 0);
  };

  const resetMatrix = () => {
    setMatrix({
      title: '',
      criteria: [],
      options: []
    });
  };

  const copyResults = () => {
    const results = matrix.options
      .map(option => ({
        name: option.name,
        score: calculateTotalScore(option)
      }))
      .sort((a, b) => b.score - a.score)
      .map((option, index) => `${index + 1}. ${option.name}: ${option.score}`)
      .join('\n');

    navigator.clipboard.writeText(results);
  };

  const updateCriterion = (criterionId: string, field: 'name' | 'weight', value: string | number) => {
    setMatrix({
      ...matrix,
      criteria: matrix.criteria.map(criterion =>
        criterion.id === criterionId
          ? { ...criterion, [field]: value }
          : criterion
      )
    });
  };

  const deleteCriterion = (criterionId: string) => {
    setMatrix({
      ...matrix,
      criteria: matrix.criteria.filter(c => c.id !== criterionId),
      options: matrix.options.map(option => ({
        ...option,
        scores: Object.fromEntries(
          Object.entries(option.scores).filter(([id]) => id !== criterionId)
        )
      }))
    });
  };

  const deleteOption = (optionId: string) => {
    setMatrix({
      ...matrix,
      options: matrix.options.filter(o => o.id !== optionId)
    });
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Decision Matrix</h2>

        {/* Matrix Title */}
        <div className="mb-8">
          <input
            type="text"
            value={matrix.title}
            onChange={(e) => setMatrix({ ...matrix, title: e.target.value })}
            placeholder="Enter decision title..."
            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Start by adding criteria (factors to consider) and options (choices to compare)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={addCriterion}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Criterion
          </button>
          <button
            onClick={addOption}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Option
          </button>
          <button
            onClick={resetMatrix}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={copyResults}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            <Copy className="h-4 w-4" />
            Copy Results
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options / Criteria
                </th>
                {matrix.criteria.map((criterion) => (
                  <th key={criterion.id} className="px-6 py-3 bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <input
                          type="text"
                          value={criterion.name}
                          onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                          placeholder="Enter criterion..."
                          className="w-full p-1 text-sm border rounded"
                        />
                        <button
                          onClick={() => deleteCriterion(criterion.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) => updateCriterion(criterion.id, 'weight', parseFloat(e.target.value))}
                          min="1"
                          max="10"
                          className="w-20 p-1 text-sm border rounded"
                        />
                        <span className="text-xs text-gray-500">Weight</span>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {matrix.options.map((option) => (
                <tr key={option.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.name}
                        onChange={(e) => setMatrix({
                          ...matrix,
                          options: matrix.options.map(o =>
                            o.id === option.id ? { ...o, name: e.target.value } : o
                          )
                        })}
                        placeholder="Enter option..."
                        className="w-full p-1 text-sm border rounded"
                      />
                      <button
                        onClick={() => deleteOption(option.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  {matrix.criteria.map((criterion) => (
                    <td key={criterion.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={option.scores[criterion.id] || 0}
                        onChange={(e) => updateScore(option.id, criterion.id, parseInt(e.target.value) || 0)}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {calculateTotalScore(option).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 