
import React from 'react';
import { Database, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

interface StoragePermissionModalProps {
  onGrant: () => void;
}

const StoragePermissionModal: React.FC<StoragePermissionModalProps> = ({ onGrant }) => {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl relative overflow-hidden animate-in slide-in-from-bottom-full duration-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 dark:bg-indigo-900/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-60 pointer-events-none" />
        <div className="h-1.5 w-12 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-4 mb-2 sm:hidden" />
        <div className="p-8 sm:p-12 relative z-10">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/20 rounded-[2rem] scale-150 blur-2xl animate-pulse" />
               <div className="bg-slate-900 dark:bg-indigo-600 w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10">
                 <Database className="w-10 h-10 text-white" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg border-4 border-white dark:border-slate-900">
                  <ShieldCheck className="w-4 h-4 text-white" />
               </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-4">Activate Storage</h2>
            <p className="text-slate-500 dark:text-slate-400 text-[14px] leading-relaxed font-medium">To enable <span className="text-indigo-600 dark:text-indigo-400 font-black">Offline Mode</span> and high-speed data sync.</p>
          </div>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-950 rounded-[1.8rem] border border-slate-100 dark:border-white/[0.05]">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm text-indigo-500"><Zap className="w-6 h-6" /></div>
              <div className="flex-1">
                <h4 className="text-[13px] font-black text-slate-900 dark:text-slate-100 uppercase">Instant Loading</h4>
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-600">Access logs without waiting for cloud.</p>
              </div>
            </div>
          </div>
          <button onClick={onGrant} className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.8rem] font-black text-[15px] uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-4 group">
            Grant Access <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoragePermissionModal;
