
import React from 'react';
import { X, FileText, Scale, AlertTriangle, Info, ShieldCheck, Ban } from 'lucide-react';

interface LegalProps {
  onClose: () => void;
}

const TermsAndConditions: React.FC<LegalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/[0.05] relative overflow-hidden animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col">
        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-white/[0.05] flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Terms of Service</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End User License Agreement (EULA)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 sm:p-10 overflow-y-auto text-slate-600 dark:text-slate-400 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Scale className="w-4 h-4 text-indigo-500" /> 1. Acceptance of Terms
            </h3>
            <p>By using the Salary OT Calculator, you agree to be bound by these terms. This app is provided "as is" for estimation purposes only. Always consult with your HR or official payroll department for final financial decisions.</p>
          </section>

          <section className="space-y-4 p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/[0.05]">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Info className="w-4 h-4 text-indigo-500" /> 2. Advertising & Monetization
            </h3>
            <p>To keep this application free, we display advertisements provided by Google AdMob. You understand that:</p>
            <ul className="list-disc pl-5 space-y-2 text-[12px]">
              <li>The app may display interstitial, banner, or rewarded video ads.</li>
              <li>We are not responsible for the content of third-party advertisements.</li>
              <li>Artificially clicking ads or using automated bots to interact with ads is strictly prohibited and may result in a permanent ban.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Ban className="w-4 h-4 text-rose-500" /> 3. Prohibited Use
            </h3>
            <p>Users may not attempt to reverse-engineer, decompile, or scrape data from the application. You agree not to use the application for any illegal activities or to manipulate financial data for fraudulent purposes.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> 4. Data Retention
            </h3>
            <p>We do not store your data on our servers. Your data lives on your device. Clearing your browser cache or deleting app data will permanently remove all logs. We are not responsible for any data loss occurring from device failure or accidental deletion.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <AlertTriangle className="w-4 h-4 text-rose-500" /> 5. Liability Disclaimer
            </h3>
            <p>The developers are not liable for any direct or indirect damages, including financial loss or inaccuracies in salary calculations. The user assumes all risk associated with the use of the calculator.</p>
          </section>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-100 dark:border-white/[0.05]">
          <button onClick={onClose} className="px-10 py-4 bg-slate-900 dark:bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
            Accept Agreement
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
