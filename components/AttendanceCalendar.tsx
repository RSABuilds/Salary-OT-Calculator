
import React, { useState } from 'react';
import { DayRecord, AttendanceStatus, AppSettings } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock, Save, X, Calendar as CalendarIcon, RotateCcw, Coffee } from 'lucide-react';

interface AttendanceCalendarProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  records: Record<string, DayRecord>;
  onUpdateRecord: (date: string, updates: Partial<DayRecord>) => void;
}

const DayModal: React.FC<{ 
  dateKey: string; 
  record: DayRecord; 
  isOffDay: boolean;
  onClose: () => void; 
  onUpdate: (updates: Partial<DayRecord>) => void 
}> = ({ dateKey, record, isOffDay, onClose, onUpdate }) => {
  const [localOt, setLocalOt] = useState(record.otHours.toString());
  const dateObj = new Date(dateKey);
  const formattedDay = dateObj.toLocaleDateString(undefined, { day: 'numeric' });
  const formattedMonth = dateObj.toLocaleDateString(undefined, { month: 'long', weekday: 'long' });

  const handleStatusChange = (status: AttendanceStatus) => {
    onUpdate({ status, otHours: parseFloat(localOt) || 0 });
    onClose();
  };

  const handleSave = () => {
    // If it's an off day, we ensure status is UNSET or whatever it was, 
    // but typically off-days don't have attendance status.
    // The requirement says only ot data can be entered.
    onUpdate({ otHours: parseFloat(localOt) || 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl border-t sm:border border-white/[0.05] relative overflow-hidden animate-in slide-in-from-bottom-full duration-500 ease-out max-h-[90vh] overflow-y-auto">
        <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-2 sm:hidden" />
        <div className="p-6 sm:p-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
               <div className={`w-14 h-14 rounded-[1.2rem] flex flex-col items-center justify-center text-white shadow-lg ${isOffDay ? 'bg-indigo-600' : record.status === AttendanceStatus.PRESENT ? 'bg-emerald-600' : record.status === AttendanceStatus.ABSENT ? 'bg-rose-500' : 'bg-slate-900'}`}>
                  <span className="text-[9px] font-black uppercase opacity-60 mb-0.5">Day</span>
                  <span className="text-2xl font-black">{formattedDay}</span>
               </div>
               <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-none mb-1.5">{formattedMonth}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isOffDay ? 'Weekly Off OT Entry' : 'Update Entry'}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 hidden sm:block">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* If it is an Off Day, hide present and absent buttons */}
            {!isOffDay && (
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleStatusChange(AttendanceStatus.PRESENT)} className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[1.8rem] border-2 transition-all ${record.status === AttendanceStatus.PRESENT ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <CheckCircle className="w-8 h-8" />
                  <span className="text-[11px] font-black uppercase">Present</span>
                </button>
                <button onClick={() => handleStatusChange(AttendanceStatus.ABSENT)} className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[1.8rem] border-2 transition-all ${record.status === AttendanceStatus.ABSENT ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-700 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  <XCircle className="w-8 h-8" />
                  <span className="text-[11px] font-black uppercase">Absent</span>
                </button>
              </div>
            )}

            {isOffDay && (
              <div className="p-6 rounded-[2rem] bg-indigo-50/50 dark:bg-indigo-950/20 border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 text-center">
                <div className="flex items-center justify-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400">
                  <Coffee className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Standard Weekly Off</span>
                </div>
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 leading-tight">Attendance status is disabled for weekly off days. You can only record overtime hours.</p>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">OT Hours</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center text-slate-400"><Clock className="w-5 h-5" /></div>
                <input type="number" step="0.5" min="0" value={localOt} onChange={(e) => setLocalOt(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-950 rounded-[1.2rem] border-2 border-transparent focus:border-indigo-500/20 dark:focus:border-indigo-600/40 text-xl font-black text-slate-900 dark:text-slate-100 outline-none" />
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-8 sm:pb-0">
                <button onClick={handleSave} className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.5rem] font-black text-[14px] uppercase shadow-xl transition-all">Save Changes</button>
                <button onClick={() => handleStatusChange(AttendanceStatus.UNSET)} className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-2"><RotateCcw className="w-3.5 h-3.5" />Reset Entry</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ settings, onSettingsChange, currentDate, onDateChange, records, onUpdateRecord }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => onDateChange(new Date(year, month - 1, 1));
  const nextMonth = () => onDateChange(new Date(year, month + 1, 1));

  const toggleOffDay = (dayIndex: number) => {
    const currentOffDays = settings.offDays || [];
    const newOffDays = currentOffDays.includes(dayIndex)
      ? currentOffDays.filter(d => d !== dayIndex)
      : [...currentOffDays, dayIndex].sort((a, b) => a - b);
    
    // When a day becomes a weekly off, we should probably check if any current records 
    // for those days in the current view have statuses that need to be cleared? 
    // Requirement says just hide them.
    onSettingsChange({ ...settings, offDays: newOffDays });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_15px_60px_rgba(0,0,0,0.02)] border border-black/[0.01] dark:border-white/[0.05] p-4 sm:p-10 h-full relative transition-colors duration-500 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-6">
        <div className="flex items-center gap-4 sm:gap-5">
           <div className="p-3 sm:p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-[1rem] sm:rounded-[1.2rem] shadow-sm">
              <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-400" />
           </div>
           <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none mb-1">
                {monthName} <span className="text-slate-300 dark:text-slate-700">{year}</span>
              </h2>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Attendance Journal</p>
           </div>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={prevMonth} className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-white/[0.05] rounded-[1rem] sm:rounded-2xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={nextMonth} className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-white/[0.05] rounded-[1rem] sm:rounded-2xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-all"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Moved Weekly Off Section here */}
      <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/[0.02]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-indigo-500" />
            <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Weekly Off Days</h4>
          </div>
          <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2.5 py-1 rounded-lg uppercase">
            {settings.offDays.length} Active
          </span>
        </div>
        <div className="flex gap-2">
          {DAYS_OF_WEEK.map((day, index) => {
            const isOff = (settings.offDays || []).includes(index);
            return (
              <button
                key={day}
                onClick={() => toggleOffDay(index)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all border-2 ${
                  isOff 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none' 
                  : 'bg-white dark:bg-slate-900 border-transparent text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-4 mb-4">
        {DAYS_OF_WEEK.map(day => <div key={day} className="text-center text-[8px] sm:text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase">{day.substring(0, 3)}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1.5 sm:gap-4 flex-1">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="aspect-square bg-slate-50/10 dark:bg-white/[0.02] rounded-xl sm:rounded-2xl" />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const dayOfWeek = date.getDay();
          const isOffDay = (settings.offDays || []).includes(dayOfWeek);
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          
          const record = records[dateKey] || { status: AttendanceStatus.UNSET, otHours: 0 };
          const isPresent = record.status === AttendanceStatus.PRESENT;
          const isAbsent = record.status === AttendanceStatus.ABSENT;
          const isUnset = record.status === AttendanceStatus.UNSET;
          const hasOt = record.otHours > 0;
          
          return (
            <button 
              key={dateKey} 
              onClick={() => setSelectedDay(dateKey)} 
              className={`relative aspect-square rounded-[0.8rem] sm:rounded-[1.5rem] p-1 transition-all duration-300 flex flex-col items-center justify-between outline-none active:scale-[0.8] ${
                isPresent ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 dark:shadow-none' : 
                isAbsent ? 'bg-rose-500 text-white shadow-lg shadow-rose-100 dark:shadow-none' : 
                hasOt ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-900 border border-amber-200 dark:border-amber-900/20' : 
                isOffDay && isUnset ? 'bg-indigo-50/30 dark:bg-indigo-900/10 text-indigo-300 dark:text-indigo-800 border border-dashed border-indigo-200/50 dark:border-indigo-800/30' : 
                'bg-slate-50 dark:bg-slate-950 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                <span className={`text-[12px] sm:text-[18px] font-black ${isPresent || isAbsent ? 'text-white' : 'text-inherit'}`}>{day}</span>
                {isOffDay && isUnset && !hasOt && (
                  <span className="absolute -top-1 sm:top-0 text-[5px] sm:text-[7px] font-black uppercase opacity-60 tracking-tighter">OFF</span>
                )}
              </div>
              {hasOt && <div className={`mt-auto mb-0.5 px-1 py-0.5 rounded-full text-[6px] sm:text-[10px] font-black w-full max-w-[85%] truncate text-center ${isPresent || isAbsent ? 'bg-white/20 backdrop-blur-md' : 'bg-amber-500 text-white'}`}>{record.otHours}h</div>}
            </button>
          );
        })}
      </div>
      
      {selectedDay && (
        <DayModal 
          dateKey={selectedDay} 
          record={records[selectedDay] || { date: selectedDay, status: AttendanceStatus.UNSET, otHours: 0 }} 
          isOffDay={settings.offDays.includes(new Date(selectedDay).getDay())}
          onClose={() => setSelectedDay(null)} 
          onUpdate={(updates) => onUpdateRecord(selectedDay, updates)} 
        />
      )}
    </div>
  );
};

export default AttendanceCalendar;
