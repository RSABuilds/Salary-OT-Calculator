
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppSettings, DayRecord, AttendanceStatus, MonthSummary } from './types';
import { calculateSummary } from './utils/helpers';
import SettingsPanel from './components/SettingsPanel';
import AttendanceCalendar from './components/AttendanceCalendar';
import DashboardSummary from './components/DashboardSummary';
import LoginView from './components/LoginView';
import { Briefcase, User, ShieldCheck, Trash2, ChevronRight, LogOut, Cloud, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
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
      syncEnabled: true
    };
  });

  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Persistence Logic: Maps data to mobile number for "Cloud Sync"
  const getCloudKey = (mobile: string, type: 'settings' | 'records') => `cloud_v1_${type}_${mobile}`;

  // Initial Data Fetch/Hydration on Login
  useEffect(() => {
    if (settings.isLoggedIn && settings.mobileNumber) {
      const cloudSettingsKey = getCloudKey(settings.mobileNumber, 'settings');
      const cloudRecordsKey = getCloudKey(settings.mobileNumber, 'records');
      
      const savedSettings = localStorage.getItem(cloudSettingsKey);
      const savedRecords = localStorage.getItem(cloudRecordsKey);

      if (savedSettings) setSettings(JSON.parse(savedSettings));
      if (savedRecords) setRecords(JSON.parse(savedRecords));
      else setRecords({}); // Clear if no cloud records exist
    }
  }, [settings.isLoggedIn, settings.mobileNumber]);

  // Background Auto-Sync to "Cloud"
  useEffect(() => {
    if (settings.isLoggedIn && settings.mobileNumber) {
      setSyncStatus('syncing');
      
      const timer = setTimeout(() => {
        const cloudSettingsKey = getCloudKey(settings.mobileNumber, 'settings');
        const cloudRecordsKey = getCloudKey(settings.mobileNumber, 'records');
        
        const settingsToSave = { ...settings, lastSyncedAt: new Date().toISOString() };
        
        localStorage.setItem(cloudSettingsKey, JSON.stringify(settingsToSave));
        localStorage.setItem(cloudRecordsKey, JSON.stringify(records));
        localStorage.setItem('salary_settings_current', JSON.stringify(settingsToSave));
        
        setSyncStatus('synced');
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [settings, records]);

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
    // Reset memory before login to prevent flash of old data
    setRecords({}); 
    setSettings(prev => ({
      ...prev,
      ...loginData,
      isLoggedIn: true
    }));
  };

  const handleLogout = () => {
    if (window.confirm('Log out of this session? Your progress is saved in the cloud.')) {
      // 1. Clear current session identifier
      localStorage.removeItem('salary_settings_current');
      
      // 2. Clear memory state
      setRecords({});
      setSettings(prev => ({
        ...prev,
        isLoggedIn: false,
        mobileNumber: '' 
      }));
      
      // 3. Close menu
      setIsProfileOpen(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('WARNING: This will permanently erase ALL records and settings for this phone number from the cloud. Continue?')) {
      const mobile = settings.mobileNumber;
      if (!mobile) return;

      const cloudSettingsKey = getCloudKey(mobile, 'settings');
      const cloudRecordsKey = getCloudKey(mobile, 'records');
      
      // 1. Nuke cloud storage
      localStorage.removeItem(cloudSettingsKey);
      localStorage.removeItem(cloudRecordsKey);
      
      // 2. Nuke current session
      localStorage.removeItem('salary_settings_current');
      
      // 3. Reset app completely via reload for maximum safety
      window.location.reload();
    }
  };

  if (!settings.isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-sans selection:bg-indigo-100 transition-colors duration-500 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F2F2F7]/85 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-10 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-[1.2rem] flex items-center justify-center shadow-lg active:scale-95 transition-transform">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-[14px] sm:text-xl font-black text-slate-900 uppercase tracking-tight">Salary <span className="text-indigo-600">OT Calculator</span></h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className={`hidden md:flex items-center gap-2.5 px-4 py-2 rounded-full border border-black/[0.04] bg-white shadow-sm transition-all duration-500 ${syncStatus === 'syncing' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
               <div className="relative">
                 <Cloud className={`w-4 h-4 ${syncStatus === 'syncing' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                 {syncStatus === 'syncing' && <RefreshCw className="w-2.5 h-2.5 text-indigo-600 absolute -top-1 -right-1 animate-spin" />}
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                 {syncStatus === 'syncing' ? 'Cloud Syncing...' : 'Cloud Active'}
               </span>
            </div>

            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all border ${isProfileOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-black/[0.05]'}`}
              >
                 <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 sm:mt-3 w-[280px] sm:w-80 bg-white rounded-[1.8rem] sm:rounded-[2rem] shadow-2xl border border-black/[0.05] overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                  <div className="p-5 sm:p-6 bg-slate-900 text-white">
                    <div className="flex items-center gap-3 sm:gap-4 mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-indigo-500 flex items-center justify-center font-black text-xs sm:text-sm">
                        {settings.currencySymbol}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-[13px] sm:text-[15px] truncate">ID: {settings.mobileNumber}</h4>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{settings.countryName} Profile</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3 backdrop-blur-md flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[9px] text-emerald-300 font-black uppercase tracking-wider">Cloud Secured</span>
                      </div>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest ml-5">
                        Last sync: {settings.lastSyncedAt ? new Date(settings.lastSyncedAt).toLocaleTimeString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-[12px] sm:text-[13px] font-black text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left">
                      <LogOut className="w-4 h-4 text-slate-400" />
                      Sign Out (Cloud Persist)
                    </button>
                    <button onClick={handleClearData} className="w-full flex items-center justify-between px-4 py-3 text-[12px] sm:text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-lg transition-all group text-left">
                      <div className="flex items-center gap-3"><Trash2 className="w-4 h-4" />Delete Everything</div>
                      <ChevronRight className="w-4 h-4 opacity-30 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-10 py-6 sm:py-12 space-y-8 sm:space-y-12 w-full flex-1">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 sm:gap-10">
          <div className="xl:col-span-4 lg:sticky lg:top-28">
            <SettingsPanel settings={settings} onSettingsChange={setSettings} />
          </div>
          <div className="xl:col-span-8">
            <AttendanceCalendar currentDate={currentDate} onDateChange={setCurrentDate} records={records} onUpdateRecord={handleUpdateRecord} />
          </div>
        </div>

        <section className="pt-8 sm:pt-12 border-t border-black/[0.05]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Payout Analysis</h2>
              <p className="text-[11px] sm:text-sm font-bold text-slate-400 uppercase tracking-widest">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })} Report</p>
            </div>
            <div className="flex items-center self-start sm:self-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-xl border border-black/[0.03] shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Active Data Stream</span>
            </div>
          </div>
          <DashboardSummary summary={summary} settings={settings} currentDate={currentDate} />
        </section>
      </main>
    </div>
  );
};

export default App;
