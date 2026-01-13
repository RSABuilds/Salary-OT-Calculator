
import React from 'react';
import { X, Shield, Eye, Lock, Bell, Globe, Fingerprint, ShieldAlert } from 'lucide-react';

interface LegalProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<LegalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-10 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/[0.05] relative overflow-hidden animate-in zoom-in-95 duration-500 max-h-[85vh] flex flex-col">
        <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-white/[0.05] flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Privacy Policy</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Compliance Edition • v1.1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-8 sm:p-10 overflow-y-auto text-slate-600 dark:text-slate-400 space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Eye className="w-4 h-4 text-indigo-500" /> Data Collection & Transparency
            </h3>
            <p>Your privacy is our priority. This app uses <strong>Local Storage</strong> for core financial data. However, to provide free services, we integrate third-party tools. We collect minimal device identifiers, technical log data, and performance metrics to ensure app stability.</p>
          </section>

          <section className="space-y-4 p-6 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/20">
            <h3 className="text-indigo-700 dark:text-indigo-400 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Bell className="w-4 h-4" /> Advertising & AdMob (GDPR/CCPA)
            </h3>
            <p className="text-[13px]">We use <strong>Google AdMob</strong> to display advertisements. To serve relevant ads, Google may collect and use:</p>
            <ul className="list-disc pl-5 space-y-2 text-[12px] font-medium">
              <li>Device Advertising ID (AAID on Android, IDFA on iOS).</li>
              <li>General location data (IP address derived).</li>
              <li>App interaction events (ad views/clicks).</li>
            </ul>
            <p className="text-[12px] italic">You can opt-out of personalized advertising via your device settings or through Google’s Ad Settings.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Globe className="w-4 h-4 text-indigo-500" /> International Rights (GDPR/CCPA/LGPD)
            </h3>
            <p>Users in the European Economic Area (EEA), United Kingdom, and California have specific rights:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Right to Access/Erasure:</strong> You can delete all your data by using the "Clear Cache" feature in-app.</li>
              <li><strong>Right to Restrict Processing:</strong> You may limit data sharing through browser privacy settings.</li>
              <li><strong>Do Not Sell:</strong> We do not sell your personal financial data to third parties.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <ShieldAlert className="w-4 h-4 text-rose-500" /> Children's Privacy (COPPA)
            </h3>
            <p>This application is not intended for individuals under the age of 13. We do not knowingly collect personal data from children. If we discover such data has been collected, it is immediately purged from local and temporary storage.</p>
          </section>

          <section className="space-y-3">
            <h3 className="text-slate-900 dark:text-slate-200 font-black flex items-center gap-2 uppercase text-xs tracking-widest">
              <Fingerprint className="w-4 h-4 text-indigo-500" /> Cookies & Local Storage
            </h3>
            <p>We use standard local storage to save your profile. Third-party ad providers may use cookies or web beacons to track ad performance and frequency capping.</p>
          </section>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-950 text-center border-t border-slate-100 dark:border-white/[0.05]">
          <button onClick={onClose} className="px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
