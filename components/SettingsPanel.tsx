
import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';
import { DollarSign, Clock, CalendarDays, Zap, X, MapPin, Coffee } from 'lucide-react';
import { DAYS_OF_WEEK } from '../constants';

// Added missing SettingsPanelProps interface
interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

const NumericInput = ({ value, onChange, placeholder, className, name, inputMode = "decimal" }: any) => {
  const [displayValue, setDisplayValue] = useState(value === 0 ? '' : value.toString());
  useEffect(() => {
    const numericCurrent = parseFloat(displayValue) || 0;
    if (value !== numericCurrent) {
      setDisplayValue(value === 0 ? '' : value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const clean = val.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const sanitized = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
    setDisplayValue(sanitized);
    const numeric = parseFloat(sanitized);
    if (!isNaN(numeric)) onChange(numeric);
    else if (sanitized === '') onChange(0);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <input
      type="text"
      name={name}
      inputMode={inputMode}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      placeholder={placeholder}
      className={className}
    />
  );
};

const InputRow = ({ icon: Icon, label, children }: any) => (
  <div className="flex flex-col gap-2 py-4 group">
    <div className="flex items-center gap-2.5 mb-0.5 px-0.5">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[12px] font-black text-slate-500 dark:text-slate-400 tracking-tight uppercase group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">
        {label}
      </span>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

// SettingsPanel now uses the defined SettingsPanelProps
const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleValueChange = (name: keyof AppSettings, value: any) => {
    onSettingsChange({ ...settings, [name]: value });
  };

  const hourlyRate = (settings.monthlySalary && settings.workingDaysPerMonth && settings.workingHoursPerDay) 
    ? (settings.monthlySalary / settings.workingDaysPerMonth) / settings.workingHoursPerDay 
    : 0;
  const autoOtRate = parseFloat(hourlyRate.toFixed(2));

  const inputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/[0.05] rounded-2xl py-3 px-4 font-black text-right outline-none transition-all duration-300 placeholder:text-slate-300 dark:placeholder:text-slate-800 focus:bg-white dark:focus:bg-slate-950 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-8 focus:ring-indigo-500/5";

  return (
    <div className="space-y-6 h-full">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.02] dark:border-white/[0.05] overflow-hidden transition-colors duration-500">
        <div className="p-6 sm:p-8 pb-0">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2.5">
            <div className="w-2 h-5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200 dark:shadow-none" />
            Parameters
          </h2>
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest px-0.5">Define your core work metrics</p>
        </div>

        <div className="px-6 sm:p-8 pb-8 pt-2 space-y-0.5">
          <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
            <div className="flex items-center justify-between py-4 px-0.5 opacity-60">
              <div className="flex items-center gap-2.5">
                 <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
                 <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Region</span>
              </div>
              <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{settings.countryName}</span>
            </div>

            <InputRow icon={DollarSign} label={`Monthly Salary`}>
              <NumericInput
                name="monthlySalary"
                value={settings.monthlySalary}
                onChange={(val: number) => handleValueChange('monthlySalary', val)}
                placeholder="0.00"
                className={`${inputBaseClass} text-indigo-600 dark:text-indigo-400 text-xl pr-10`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300 dark:text-indigo-800 font-black text-sm">
                {settings.currencySymbol}
              </div>
            </InputRow>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <InputRow icon={CalendarDays} label="Days">
                <NumericInput
                  name="workingDaysPerMonth"
                  inputMode="numeric"
                  value={settings.workingDaysPerMonth}
                  onChange={(val: number) => handleValueChange('workingDaysPerMonth', val)}
                  className={`${inputBaseClass} text-slate-900 dark:text-slate-100 text-base`}
                />
              </InputRow>

              <InputRow icon={Clock} label="Hrs/Day">
                <NumericInput
                  name="workingHoursPerDay"
                  value={settings.workingHoursPerDay}
                  onChange={(val: number) => handleValueChange('workingHoursPerDay', val)}
                  className={`${inputBaseClass} text-slate-900 dark:text-slate-100 text-base`}
                />
              </InputRow>
            </div>
          </div>

          <div className="pt-4 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] p-5 space-y-4 border border-slate-100 dark:border-white/[0.05]">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">OT Mode</span>
                <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
                  <button onClick={() => handleValueChange('otRateMode', 'auto')} className={`px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${settings.otRateMode === 'auto' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}>SYNC</button>
                  <button onClick={() => handleValueChange('otRateMode', 'manual')} className={`px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${settings.otRateMode === 'manual' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}>MANUAL</button>
                </div>
              </div>
              <div className="relative">
                {settings.otRateMode === 'auto' ? (
                  <div className="w-full px-5 py-4 rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-black text-xl text-right flex items-center justify-end relative">
                    <span className="absolute left-5 text-[10px] text-indigo-300 dark:text-indigo-800 font-black uppercase">{settings.currencySymbol}</span>
                    {autoOtRate}
                  </div>
                ) : (
                  <div className="relative">
                     <NumericInput name="manualOtRate" value={settings.manualOtRate} onChange={(val: number) => handleValueChange('manualOtRate', val)} className={`${inputBaseClass} text-slate-900 dark:text-slate-100 text-xl pr-10`} />
                     <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 dark:text-slate-700 font-black uppercase pointer-events-none">{settings.currencySymbol}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
