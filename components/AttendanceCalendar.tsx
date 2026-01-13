import React, { useState } from 'react';
import { DayRecord, AttendanceStatus } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Save, X, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface AttendanceCalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  records: Record<string, DayRecord>;
  onUpdateRecord: (date: string, updates: Partial<DayRecord>) => void;
}

interface DayModalProps {
  dateKey: string;
  record: DayRecord;
  onClose: () => void;
  onUpdate: (updates: Partial<DayRecord>) => void;
}

const DayModal: React.FC<DayModalProps> = ({ dateKey, record, onClose, onUpdate }) => {
  const [localOt, setLocalOt] = useState(record.otHours.toString());
  const dateObj = new Date(dateKey);
  const formattedDay = dateObj.toLocaleDateString(undefined, { day: 'numeric' });
  const formattedMonth = dateObj.toLocaleDateString(undefined, { month: 'long', weekday: 'long' });

  const handleStatusChange = (status: AttendanceStatus) => {
    onUpdate({ status, otHours: parseFloat(localOt) || 0 });
    onClose();
  };

  const handleSave = () => {
    onUpdate({ otHours: parseFloat(localOt) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-full sm:slide-in-from-bottom-20 duration-500 ease-out max-h-[90vh] overflow-y-auto">
        {/* Mobile Pull Handle */}
        <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-4 mb-2 sm:hidden" />
        
        <div className="p-6 sm:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-[1.2rem] flex flex-col items-center justify-center text-white shadow-lg transition-all duration-500 ${record.status === AttendanceStatus.PRESENT ? 'bg-emerald-600 shadow-emerald-200' : record.status === AttendanceStatus.ABSENT ? 'bg-rose-500 shadow-rose-200' : 'bg-slate-900 shadow-slate-200'}`}>
                  <span className="text-[9px] font-black uppercase tracking-tighter opacity-60 leading-none mb-0.5">Day</span>
                  <span className="text-2xl font-black leading-none">{formattedDay}</span>
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none mb-1.5">{formattedMonth}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance Status</span>
                  </div>
               </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 sm:block hidden">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleStatusChange(AttendanceStatus.PRESENT)}
                className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[1.8rem] border-2 transition-all duration-300 active:scale-95 ${
                  record.status === AttendanceStatus.PRESENT 
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-100' 
                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                }`}
              >
                <CheckCircle className={`w-8 h-8 ${record.status === AttendanceStatus.PRESENT ? 'text-emerald-600' : 'text-slate-300'}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">Present</span>
              </button>
              <button
                onClick={() => handleStatusChange(AttendanceStatus.ABSENT)}
                className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[1.8rem] border-2 transition-all duration-300 active:scale-95 ${
                  record.status === AttendanceStatus.ABSENT 
                    ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-lg shadow-rose-100' 
                    : 'bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100'
                }`}
              >
                <XCircle className={`w-8 h-8 ${record.status === AttendanceStatus.ABSENT ? 'text-rose-600' : 'text-slate-300'}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">Absent</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Hours</label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400">
                  <Clock className="w-5 h-5" />
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  inputMode="decimal"
                  value={localOt}
                  onChange={(e) => setLocalOt(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[1.2rem] border-2 border-transparent focus:border-indigo-500/20 focus:bg-white transition-all outline-none text-xl font-black text-slate-900"
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-8 sm:pb-0">
                <button
                  onClick={handleSave}
                  className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-[14px] uppercase tracking-[0.1em] shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  onClick={() => handleStatusChange(AttendanceStatus.UNSET)}
                  className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Entry
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  currentDate,
  onDateChange,
  records,
  onUpdateRecord,
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));

  return (
    <div className="bg-white rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_15px_60px_rgba(0,0,0,0.02)] border border-black/[0.01] p-4 sm:p-10 h-full relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
           <div className="p-3 sm:p-4 bg-indigo-50 rounded-[1rem] sm:rounded-[1.2rem] shadow-sm">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
           </div>
           <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
                {monthName} <span className="text-slate-300">{year}</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attendance Journal</p>
           </div>
        </div>
        
        <div className="flex gap-2 sm:gap-3 items-center">
          <button 
            onClick={prevMonth} 
            className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-slate-100 rounded-[1rem] sm:rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" /> 
          </button>
          <button 
            onClick={nextMonth} 
            className="group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-slate-100 rounded-[1rem] sm:rounded-2xl text-slate-600 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-90"
            aria-label="Next Month"
          >
             <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-4 mb-4">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center text-[8px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.1em] sm:tracking-widest pb-1 sm:pb-2">
            {day.substring(0, 3)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-4">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square bg-slate-50/10 rounded-xl sm:rounded-2xl" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const record = records[dateKey] || { status: AttendanceStatus.UNSET, otHours: 0 };
          
          const isPresent = record.status === AttendanceStatus.PRESENT;
          const isAbsent = record.status === AttendanceStatus.ABSENT;
          const hasOt = record.otHours > 0;
          const otOnly = !isPresent && !isAbsent && hasOt;

          return (
            <button
              key={dateKey}
              onClick={() => setSelectedDay(dateKey)}
              className={`
                relative aspect-square rounded-[0.8rem] sm:rounded-[1.5rem] p-1 sm:p-2 transition-all duration-300 flex flex-col items-center justify-between outline-none active:scale-[0.8] group/day
                ${isPresent ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : ''}
                ${isAbsent ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : ''}
                ${otOnly ? 'bg-amber-100 text-amber-900 border border-amber-200' : ''}
                ${!isPresent && !isAbsent && !hasOt ? 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-indigo-500' : ''}
              `}
            >
              <div className="flex-1 flex items-center justify-center w-full">
                <span className={`
                  text-[12px] sm:text-[18px] font-black leading-none transition-transform duration-300
                  ${isPresent || isAbsent ? 'text-white' : otOnly ? 'text-amber-900' : 'text-inherit'}
                `}>
                  {day}
                </span>
              </div>
              
              {hasOt && (
                <div className={`
                  mt-auto mb-0.5 px-1 py-0.5 rounded-full text-[6px] sm:text-[10px] font-black uppercase tracking-tight w-full max-w-[85%] truncate text-center
                  ${isPresent || isAbsent ? 'bg-white/20 text-white backdrop-blur-md' : 'bg-amber-500 text-white'}
                `}>
                  {record.otHours}h
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-50 flex flex-wrap gap-x-6 gap-y-3">
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Present</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Absent</span>
        </div>
        <div className="flex items-center gap-2 group cursor-default">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OT Hours</span>
        </div>
      </div>

      {selectedDay && (
        <DayModal
          dateKey={selectedDay}
          record={records[selectedDay] || { date: selectedDay, status: AttendanceStatus.UNSET, otHours: 0 }}
          onClose={() => setSelectedDay(null)}
          onUpdate={(updates) => onUpdateRecord(selectedDay, updates)}
        />
      )}
    </div>
  );
};

export default AttendanceCalendar;