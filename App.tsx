
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppSettings, DayRecord, AttendanceStatus, MonthSummary } from './types';
import { calculateSummary } from './utils/helpers';
import SettingsPanel from './components/SettingsPanel';
import AttendanceCalendar from './components/AttendanceCalendar';
import DashboardSummary from './components/DashboardSummary';
import LoginView from './components/LoginView';
import StoragePermissionModal from './components/StoragePermissionModal';
import { Briefcase, User, ShieldCheck, Trash2, ChevronRight, LogOut, Cloud, RefreshCw, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Theme management: Detect system or saved preference
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('app_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Storage access tracking
  const [hasStorageAccess, setHasStorageAccess] = useState<boolean>(() => {
    return localStorage.getItem('app_storage_authorized') === 'true';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('salary_settings_current');
    return saved ? JSON.parse(saved) : {
      monthlySalary: 3000,
      workingDaysPerMonth: 30,
      workingHoursPerDay: 8,
      otRateMode: 'auto',
      manualOtRate: 20,
      currency: 'USD',
      currencySymbol: '$',
      countryName: 'United States',
      mobileNumber: '',
      isLoggedIn: false,
      syncEnabled: true,
      offDays: [0] // Sunday default
    };
  });

  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Synchronize theme with HTML root class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStorageKey = (mobile: string, type: 'settings' | 'records') => `salary_data_v2_${type}_${mobile}`;

  // Data hydration
  useEffect(() => {
    if (settings.isLoggedIn && settings.mobileNumber && hasStorageAccess) {
      const storageSettingsKey = getStorageKey(settings.mobileNumber, 'settings');
      const storageRecordsKey = getStorageKey(settings.mobileNumber, 'records');
      
      const savedSettings = localStorage.getItem(storageSettingsKey);
      const savedRecords = localStorage.getItem(storageRecordsKey);

      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedRecords) setRecords(JSON.parse(savedRecords));
      else setRecords({}); 
    }
  }, [settings.isLoggedIn, settings.mobileNumber, hasStorageAccess]);

  // Real-time persistence
  useEffect(() => {
    if (settings.isLoggedIn && settings.mobileNumber && hasStorageAccess) {
      setSyncStatus('syncing');
      const storageSettingsKey = getStorageKey(settings.mobileNumber, 'settings');
      const storageRecordsKey = getStorageKey(settings.mobileNumber, 'records');
      const settingsToSave = { ...settings, lastSyncedAt: new Date().toISOString() };
      localStorage.setItem(storageSettingsKey, JSON.stringify(settingsToSave));
      localStorage.setItem(storageRecordsKey, JSON.stringify(records));
      localStorage.setItem('salary_settings_current', JSON.stringify(settingsToSave));
      const timer = setTimeout(() => setSyncStatus('synced'), 600);
      return () => clearTimeout(timer);
    }
  }, [settings, records, hasStorageAccess]);

  // Close profile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const summary = useMemo(() => {
    const yearMonthPrefix = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const monthlyRecords = (Object.values(records) as DayRecord[]).filter(r => r.date.startsWith(yearMonthPrefix));
    return calculateSummary(settings, monthlyRecords);
  }, [settings, records, currentDate]);

  const handleUpdateRecord = (date: string, updates: Partial<DayRecord>) => {
    setRecords(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        date,
        status: updates.status ?? prev[date]?.status ?? AttendanceStatus.UNSET,
        otHours: updates.otHours ?? prev[date]?.otHours ?? 0,
      }
    }));
  };

  const handleLogin = (loginData: Partial<AppSettings>) => {
    setRecords({}); 
    setSettings(prev => ({ ...prev, ...loginData, isLoggedIn: true }));
  };

  const handleLogout = () => {
    if (window.confirm('Log out of your profile? Your local data will remain saved.')) {
      localStorage.removeItem('salary_settings_current');
      setRecords({});
      setSettings(prev => ({ ...prev, isLoggedIn: false, mobileNumber: '' }));
      setIsProfileOpen(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Erase all local logs? This cannot be undone.')) {
      const mobile = settings.mobileNumber;
      if (!mobile) return;
      localStorage.removeItem(getStorageKey(mobile, 'settings'));
      localStorage.removeItem(getStorageKey(mobile, 'records'));
      localStorage.removeItem('salary_settings_current');
      localStorage.removeItem('app_storage_authorized');
      window.location.reload();
    }
  };

  const handleGrantStorageAccess = () => {
    localStorage.setItem('app_storage_authorized', 'true');
    setHasStorageAccess(true);
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // Render view states
  if (!hasStorageAccess) {
    return <StoragePermissionModal onGrant={handleGrantStorageAccess} />;
  }

  if (!settings.isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-slate-950 flex flex-col font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900/40 transition-colors duration-500 overflow-x-hidden">
      <header className="sticky top-0 z-50 bg-[#F2F2F7]/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-black/[0.04] dark:border-white/[0.04]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 dark:bg-indigo-600 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-[1.2rem] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-[14px] sm:text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Salary <span className="text-indigo-600 dark:text-indigo-400">OT Calculator</span></h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/[0.04] dark:border-white/[0.04] bg-white dark:bg-slate-900 shadow-sm transition-all duration-500">
               {isOnline ? (
                 <Cloud className={`w-4 h-4 ${syncStatus === 'syncing' ? 'text-indigo-400' : 'text-indigo-500'}`} />
               ) : (
                 <WifiOff className="w-4 h-4 text-rose-500" />
               )}
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                 {!isOnline ? 'Local Mode' : syncStatus === 'syncing' ? 'Syncing...' : 'Synced'}
               </span>
            </div>

            <button 
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center bg-white dark:bg-slate-900 border border-black/[0.05] dark:border-white/[0.05] text-slate-400 dark:text-indigo-300 transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border ${isProfileOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none' : 'bg-white dark:bg-slate-900 text-slate-400 border-black/[0.05] dark:border-white/[0.05]'}`}
              >
                 <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 sm:mt-3 w-[280px] sm:w-80 bg-white dark:bg-slate-900 rounded-[1.8rem] sm:rounded-[2rem] shadow-2xl border border-black/[0.05] dark:border-white/[0.05] overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="p-5 sm:p-6 bg-slate-900 dark:bg-slate-950 text-white">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-500 flex items-center justify-center font-black text-xs sm:text-sm">
                        {settings.currencySymbol}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[13px] sm:text-[15px] truncate">ID: {settings.mobileNumber}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{settings.countryName}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 bg-white dark:bg-slate-900">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[12px] sm:text-[13px] font-black text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left">
                      <LogOut className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      Sign Out
                    </button>
                    <button onClick={handleClearData} className="w-full flex items-center justify-between px-4 py-3 text-[12px] sm:text-[13px] font-black text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all group text-left">
                      <div className="flex items-center gap-3"><Trash2 className="w-4 h-4" />Delete Local Cache</div>
                      <ChevronRight className="w-4 h-4 opacity-30 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-10 py-6 sm:py-12 space-y-8 sm:space-y-12 w-full flex-1 transition-colors duration-500">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10">
          <div className="xl:col-span-4 lg:sticky lg:top-28">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
          <div className="xl:col-span-8">
            <AttendanceCalendar settings={settings} onSettingsChange={setSettings} currentDate={currentDate} onDateChange={setCurrentDate} records={records} onUpdateRecord={handleUpdateRecord} />
          </div>
        </div>

        <section className="pt-8 sm:pt-12 border-t border-black/[0.05] dark:border-white/[0.05]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Payout Analysis</h2>
              <p className="text-[11px] sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Report</p>
            </div>
            {!isOnline && (
              <div className="flex items-center self-start sm:self-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-900/20 shadow-sm">
                <WifiOff className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Offline Mode Active</span>
              </div>
            )}
          </div>
          <DashboardSummary summary={summary} settings={settings} currentDate={currentDate} />
        </section>
      </main>
    </div>
  );
};

export default App;
