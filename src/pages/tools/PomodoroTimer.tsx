import { useState, useEffect } from 'react';

export function PomodoroTimer() {
  const [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => (time > 0 ? time - 1 : 0));
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, time]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setTime(1500);
    setIsActive(false);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Pomodoro Timer
        </h2>
        <div className="font-['Roboto_Mono'] text-6xl tabular-nums tracking-wider text-gray-900 dark:text-white">
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </div>
        <div className="flex justify-center space-x-4 mt-6">
          <button 
            onClick={toggle} 
            className="w-24 bg-blue-500 dark:bg-blue-600 text-white p-4 rounded 
                     hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={reset} 
            className="w-24 bg-red-500 dark:bg-red-600 text-white p-4 rounded 
                     hover:bg-red-600 dark:hover:bg-red-700"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
} 