import { useCalendar } from './CalendarProvider';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarHeader() {
  return (
    <div className="grid grid-cols-7 border-b border-gray-200">
      {DAYS.map((day) => (
        <div
          key={day}
          className="py-2 px-3 text-sm font-medium text-gray-500 text-center"
        >
          {day}
        </div>
      ))}
    </div>
  );
}