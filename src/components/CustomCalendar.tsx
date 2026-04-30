
import { useState, useMemo } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  isBefore, 
  startOfDay,
  addDays,
  differenceInDays
} from 'date-fns';
import { enUS, vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CustomCalendarProps {
  checkIn?: string;
  checkOut?: string;
  onRangeSelect: (range: { checkIn: string; checkOut: string }) => void;
  lang: 'en' | 'vi';
  t: any;
}

export function CustomCalendar({ checkIn, checkOut, onRangeSelect, lang, t }: CustomCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const locale = lang === 'vi' ? vi : enUS;

  const startDate = checkIn ? new Date(checkIn) : null;
  const endDate = checkOut ? new Date(checkOut) : null;

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  }, [currentMonth]);

  const handleDateClick = (day: Date) => {
    const dayStart = startOfDay(day);
    const today = startOfDay(new Date());

    if (isBefore(dayStart, today)) return;

    if (!startDate || (startDate && endDate)) {
      onRangeSelect({ checkIn: format(dayStart, 'yyyy-MM-dd'), checkOut: '' });
    } else if (startDate && !endDate) {
      if (isBefore(dayStart, startDate)) {
        onRangeSelect({ checkIn: format(dayStart, 'yyyy-MM-dd'), checkOut: '' });
      } else if (isSameDay(dayStart, startDate)) {
        // Clear if clicking same day
        onRangeSelect({ checkIn: '', checkOut: '' });
      } else {
        onRangeSelect({ checkIn: format(startDate, 'yyyy-MM-dd'), checkOut: format(dayStart, 'yyyy-MM-dd') });
      }
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const isSelected = (day: Date) => {
    if (startDate && isSameDay(day, startDate)) return true;
    if (endDate && isSameDay(day, endDate)) return true;
    return false;
  };

  const isInRange = (day: Date) => {
    if (startDate && endDate) {
      return isWithinInterval(day, { start: startDate, end: endDate });
    }
    return false;
  };

  const nights = startDate && endDate ? differenceInDays(endDate, startDate) : 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 w-full max-w-sm mx-auto relative z-[1000] opacity-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-ocean capitalize">
          {format(currentMonth, 'MMMM yyyy', { locale })}
        </h3>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={prevMonth}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-ocean transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button"
            onClick={nextMonth}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-ocean transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
          <div key={d} className="text-[10px] font-black text-slate-300 text-center uppercase tracking-widest py-2">
            {lang === 'vi' ? d : (d === 'T2' ? 'Mo' : d === 'T3' ? 'Tu' : d === 'T4' ? 'We' : d === 'T5' ? 'Th' : d === 'T6' ? 'Fr' : d === 'T7' ? 'Sa' : 'Su')}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameDay(startOfMonth(day), startOfMonth(currentMonth));
          const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
          const selected = isSelected(day);
          const inRange = isInRange(day);
          const isRangeStart = startDate && isSameDay(day, startDate);
          const isRangeEnd = endDate && isSameDay(day, endDate);

          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => handleDateClick(day)}
              className={`
                relative h-10 w-10 flex items-center justify-center text-sm font-bold rounded-xl transition-all
                ${!isCurrentMonth ? 'opacity-20' : ''}
                ${isPast ? 'text-slate-200 cursor-not-allowed' : 'text-slate-600 hover:bg-ocean/10 hover:text-ocean'}
                ${selected ? 'bg-ocean text-white hover:bg-ocean' : ''}
                ${inRange && !selected ? 'bg-ocean/5 text-ocean rounded-none' : ''}
                ${isRangeStart && endDate ? 'rounded-r-none' : ''}
                ${isRangeEnd ? 'rounded-l-none' : ''}
                ${isToday && !selected ? 'border-2 border-gold/30' : ''}
              `}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {isToday && !selected && (
                <div className="absolute bottom-1 w-1 h-1 bg-gold rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sand/30 rounded-xl text-gold">
            <CalendarIcon size={16} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              {lang === 'vi' ? 'Thời gian' : 'Duration'}
            </p>
            <p className="text-xs font-bold text-ocean">
              {nights > 0 ? `${nights} ${lang === 'vi' ? 'đêm' : 'nights'}` : '---'}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
           <div className={`h-2 w-2 rounded-full ${startDate ? 'bg-ocean' : 'bg-slate-200'}`}></div>
           <div className={`h-2 w-2 rounded-full ${endDate ? 'bg-ocean' : 'bg-slate-200'}`}></div>
        </div>
      </div>
    </div>
  );
}
