
import React, { useState, useEffect, useRef } from 'react';
import { AppSettings } from '../types';
import { DollarSign, Clock, CalendarDays, Zap, X, MapPin } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

// 1. Move NumericInput OUTSIDE to keep it stable across renders
const NumericInput = ({ value, onChange, placeholder, className, name, inputMode = "decimal" }: any) => {
  // We keep a string state to allow "0.", empty strings, etc. while typing
  const [displayValue, setDisplayValue] = useState(value === 0 ? '' : value.toString());
  
  // Sync display value if the PROP value changes externally (e.g. from cloud or profile change)
  // but DON'T sync if the numeric value is the same as what we're currently typing
  useEffect(() => {
    const numericCurrent = parseFloat(displayValue) || 0;
    if (value !== numericCurrent) {
      setDisplayValue(value === 0 ? '' : value.toString());
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    // Allow digits and one decimal point only
    const clean = val.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    const sanitized = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
    
    setDisplayValue(sanitized);
    
    const numeric = parseFloat(sanitized);
    if (!isNaN(numeric)) {
      onChange(numeric);
    } else if (sanitized === '') {
      onChange(0);
    }
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

// 2. Move InputRow OUTSIDE to prevent unmounting/focus-loss
const InputRow = ({ icon: Icon, label, children }: any) => (
  <div className="flex flex-col gap-2 py-4 group">
    <div className="flex items-center gap-2.5 mb-0.5 px-0.5">
      <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-focus-within:bg-indigo-600 group-focus-within:text-white transition-all duration-300">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="text-[12px] font-black text-slate-500 tracking-tight uppercase group-focus-within:text-indigo-600 transition-colors">
        {label}
      </span>
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onSettingsChange }) => {
  const handleValueChange = (name: keyof AppSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [name]: value,
    });
  };

  const hourlyRate = (settings.monthlySalary && settings.workingDaysPerMonth && settings.workingHoursPerDay) 
    ? (settings.monthlySalary / settings.workingDaysPerMonth) / settings.workingHoursPerDay 
    : 0;
  const autoOtRate = parseFloat(hourlyRate.toFixed(2));

  const inputBaseClass = "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3 px-4 font-black text-right outline-none transition-all duration-300 placeholder:text-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5";

  return (
    <div className="space-y-6 h-full">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-black/[0.02] overflow-hidden">
        <div className="p-6 sm:p-8 pb-0">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-2 h-5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-200" />
            Parameters
          </h2>
          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest px-0.5">Define your core work metrics</p>
        </div>

        <div className="px-6 sm:p-8 pb-8 pt-2 space-y-0.5">
          <div className="divide-y divide-black/[0.03]">
            {/* Display Region Info */}
            <div className="flex items-center justify-between py-4 px-0.5 opacity-60">
              <div className="flex items-center gap-2.5">
                 <MapPin className="w-3.5 h-3.5 text-slate-400" />
                 <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Region</span>
              </div>
              <span className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">{settings.countryName} ({settings.currency})</span>
            </div>

            <InputRow icon={DollarSign} label={`Monthly Salary (${settings.currencySymbol})`}>
              <NumericInput
                name="monthlySalary"
                value={settings.monthlySalary}
                onChange={(val: number) => handleValueChange('monthlySalary', val)}
                placeholder="0.00"
                className={`${inputBaseClass} text-indigo-600 text-xl pr-10`}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300 font-black text-sm">
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
                  placeholder="0"
                  className={`${inputBaseClass} text-slate-900 text-base`}
                />
              </InputRow>

              <InputRow icon={Clock} label="Hrs/Day">
                <NumericInput
                  name="workingHoursPerDay"
                  value={settings.workingHoursPerDay}
                  onChange={(val: number) => handleValueChange('workingHoursPerDay', val)}
                  placeholder="0"
                  className={`${inputBaseClass} text-slate-900 text-base`}
                />
              </InputRow>
            </div>
          </div>

          <div className="pt-4">
            <div className="bg-slate-50 rounded-[1.5rem] p-5 space-y-4 border border-slate-100">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">OT Mode</span>
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                  <button 
                    onClick={() => handleValueChange('otRateMode', 'auto')}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${settings.otRateMode === 'auto' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    SYNC
                  </button>
                  <button 
                    onClick={() => handleValueChange('otRateMode', 'manual')}
                    className={`px-3 py-1.5 text-[9px] font-black rounded-md transition-all ${settings.otRateMode === 'manual' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    MANUAL
                  </button>
                </div>
              </div>

              <div className="relative">
                {settings.otRateMode === 'auto' ? (
                  <div className="w-full px-5 py-4 rounded-xl border border-indigo-100 bg-indigo-50/50 text-indigo-600 font-black text-xl text-right flex items-center justify-end relative">
                    <span className="absolute left-5 text-[10px] text-indigo-300 font-black uppercase">{settings.currencySymbol}</span>
                    {autoOtRate}
                  </div>
                ) : (
                  <div className="relative">
                     <NumericInput
                      name="manualOtRate"
                      value={settings.manualOtRate}
                      onChange={(val: number) => handleValueChange('manualOtRate', val)}
                      className={`${inputBaseClass} text-slate-900 text-xl pr-10`}
                      placeholder="0.00"
                    />
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[10px] text-slate-300 font-black uppercase pointer-events-none">{settings.currencySymbol}</span>
                  </div>
                )}
                <div className="absolute right-4 -bottom-2 px-1.5 py-0.5 bg-white border border-slate-100 rounded-md shadow-sm">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Rate/Hr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
