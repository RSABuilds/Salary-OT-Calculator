
import React, { useState, useMemo, useEffect } from 'react';
import { AppSettings } from '../types';
import { Phone, ArrowRight, Briefcase, ShieldCheck, Search, Check, Cloud, Loader2 } from 'lucide-react';

interface LoginViewProps {
  onLogin: (data: Partial<AppSettings>) => void;
}

const COUNTRIES = [
  { name: 'Afghanistan', code: 'AFN', symbol: '؋' },
  { name: 'Albania', code: 'ALL', symbol: 'L' },
  { name: 'Algeria', code: 'DZD', symbol: 'د.ج' },
  { name: 'Andorra', code: 'EUR', symbol: '€' },
  { name: 'Angola', code: 'AOA', symbol: 'Kz' },
  { name: 'Argentina', code: 'ARS', symbol: '$' },
  { name: 'Armenia', code: 'AMD', symbol: '֏' },
  { name: 'Australia', code: 'AUD', symbol: '$' },
  { name: 'Austria', code: 'EUR', symbol: '€' },
  { name: 'Azerbaijan', code: 'AZN', symbol: '₼' },
  { name: 'Bahamas', code: 'BSD', symbol: '$' },
  { name: 'Bahrain', code: 'BHD', symbol: '.د.ب' },
  { name: 'Bangladesh', code: 'BDT', symbol: '৳' },
  { name: 'Barbados', code: 'BBD', symbol: '$' },
  { name: 'Belarus', code: 'BYN', symbol: 'Br' },
  { name: 'Belgium', code: 'EUR', symbol: '€' },
  { name: 'Belize', code: 'BZD', symbol: '$' },
  { name: 'Bhutan', code: 'BTN', symbol: 'Nu.' },
  { name: 'Bolivia', code: 'BOB', symbol: 'Bs.' },
  { name: 'Bosnia and Herzegovina', code: 'BAM', symbol: 'KM' },
  { name: 'Botswana', code: 'BWP', symbol: 'P' },
  { name: 'Brazil', code: 'BRL', symbol: 'R$' },
  { name: 'Brunei', code: 'BND', symbol: '$' },
  { name: 'Bulgaria', code: 'BGN', symbol: 'лв' },
  { name: 'Cambodia', code: 'KHR', symbol: '៛' },
  { name: 'Cameroon', code: 'XAF', symbol: 'FCFA' },
  { name: 'Canada', code: 'CAD', symbol: '$' },
  { name: 'Chile', code: 'CLP', symbol: '$' },
  { name: 'China', code: 'CNY', symbol: '¥' },
  { name: 'Colombia', code: 'COP', symbol: '$' },
  { name: 'Costa Rica', code: 'CRC', symbol: '₡' },
  { name: 'Croatia', code: 'EUR', symbol: '€' },
  { name: 'Cuba', code: 'CUP', symbol: '$' },
  { name: 'Cyprus', code: 'EUR', symbol: '€' },
  { name: 'Czech Republic', code: 'CZK', symbol: 'Kč' },
  { name: 'Denmark', code: 'DKK', symbol: 'kr' },
  { name: 'Dominican Republic', code: 'DOP', symbol: '$' },
  { name: 'Ecuador', code: 'USD', symbol: '$' },
  { name: 'Egypt', code: 'EGP', symbol: 'E£' },
  { name: 'El Salvador', code: 'USD', symbol: '$' },
  { name: 'Estonia', code: 'EUR', symbol: '€' },
  { name: 'Ethiopia', code: 'ETB', symbol: 'Br' },
  { name: 'Europe', code: 'EUR', symbol: '€' },
  { name: 'Fiji', code: 'FJD', symbol: '$' },
  { name: 'Finland', code: 'EUR', symbol: '€' },
  { name: 'France', code: 'EUR', symbol: '€' },
  { name: 'Georgia', code: 'GEL', symbol: '₾' },
  { name: 'Germany', code: 'EUR', symbol: '€' },
  { name: 'Ghana', code: 'GHS', symbol: 'GH₵' },
  { name: 'Greece', code: 'EUR', symbol: '€' },
  { name: 'Guatemala', code: 'GTQ', symbol: 'Q' },
  { name: 'Honduras', code: 'HNL', symbol: 'L' },
  { name: 'Hungary', code: 'HUF', symbol: 'Ft' },
  { name: 'Iceland', code: 'ISK', symbol: 'kr' },
  { name: 'India', code: 'INR', symbol: '₹' },
  { name: 'Indonesia', code: 'IDR', symbol: 'Rp' },
  { name: 'Iran', code: 'IRR', symbol: '﷼' },
  { name: 'Iraq', code: 'IQD', symbol: 'ع.د' },
  { name: 'Ireland', code: 'EUR', symbol: '€' },
  { name: 'Italy', code: 'EUR', symbol: '€' },
  { name: 'Jamaica', code: 'JMD', symbol: '$' },
  { name: 'Japan', code: 'JPY', symbol: '¥' },
  { name: 'Jordan', code: 'JOD', symbol: 'د.أ' },
  { name: 'Kazakhstan', code: 'KZT', symbol: '₸' },
  { name: 'Kenya', code: 'KES', symbol: 'KSh' },
  { name: 'Kuwait', code: 'KWD', symbol: 'د.ك' },
  { name: 'Lebanon', code: 'LBP', symbol: 'ل.ل' },
  { name: 'Libya', code: 'LYD', symbol: 'ل.د' },
  { name: 'Luxembourg', code: 'EUR', symbol: '€' },
  { name: 'Malaysia', code: 'MYR', symbol: 'RM' },
  { name: 'Maldives', code: 'MVR', symbol: 'Rf' },
  { name: 'Malta', code: 'EUR', symbol: '€' },
  { name: 'Mauritius', code: 'MUR', symbol: '₨' },
  { name: 'Mexico', code: 'MXN', symbol: '$' },
  { name: 'Monaco', code: 'EUR', symbol: '€' },
  { name: 'Mongolia', code: 'MNT', symbol: '₮' },
  { name: 'Morocco', code: 'MAD', symbol: 'د.م.' },
  { name: 'Myanmar', code: 'MMK', symbol: 'K' },
  { name: 'Nepal', code: 'NPR', symbol: '₨' },
  { name: 'Netherlands', code: 'EUR', symbol: '€' },
  { name: 'New Zealand', code: 'NZD', symbol: '$' },
  { name: 'Nigeria', code: 'NGN', symbol: '₦' },
  { name: 'Norway', code: 'NOK', symbol: 'kr' },
  { name: 'Oman', code: 'OMR', symbol: 'ر.ع.' },
  { name: 'Pakistan', code: 'PKR', symbol: '₨' },
  { name: 'Palestine', code: 'JOD', symbol: 'د.أ' },
  { name: 'Panama', code: 'PAB', symbol: 'B/.' },
  { name: 'Paraguay', code: 'PYG', symbol: '₲' },
  { name: 'Peru', code: 'PEN', symbol: 'S/.' },
  { name: 'Philippines', code: 'PHP', symbol: '₱' },
  { name: 'Poland', code: 'PLN', symbol: 'zł' },
  { name: 'Portugal', code: 'EUR', symbol: '€' },
  { name: 'Qatar', code: 'QAR', symbol: 'ر.ق' },
  { name: 'Romania', code: 'RON', symbol: 'lei' },
  { name: 'Russia', code: 'RUB', symbol: '₽' },
  { name: 'Saudi Arabia', code: 'SAR', symbol: 'ر.س' },
  { name: 'Serbia', code: 'RSD', symbol: 'din.' },
  { name: 'Singapore', code: 'SGD', symbol: '$' },
  { name: 'Slovakia', code: 'EUR', symbol: '€' },
  { name: 'Slovenia', code: 'EUR', symbol: '€' },
  { name: 'South Africa', code: 'ZAR', symbol: 'R' },
  { name: 'South Korea', code: 'KRW', symbol: '₩' },
  { name: 'Spain', code: 'EUR', symbol: '€' },
  { name: 'Sri Lanka', code: 'LKR', symbol: '₨' },
  { name: 'Sudan', code: 'SDG', symbol: '£' },
  { name: 'Sweden', code: 'SEK', symbol: 'kr' },
  { name: 'Switzerland', code: 'CHF', symbol: 'CHF' },
  { name: 'Syria', code: 'SYP', symbol: '£' },
  { name: 'Taiwan', code: 'TWD', symbol: 'NT$' },
  { name: 'Tanzania', code: 'TZS', symbol: 'Sh' },
  { name: 'Thailand', code: 'THB', symbol: '฿' },
  { name: 'Tunisia', code: 'TND', symbol: 'د.ت' },
  { name: 'Turkey', code: 'TRY', symbol: '₺' },
  { name: 'Ukraine', code: 'UAH', symbol: '₴' },
  { name: 'United Arab Emirates', code: 'AED', symbol: 'د.إ' },
  { name: 'United Kingdom', code: 'GBP', symbol: '£' },
  { name: 'United States', code: 'USD', symbol: '$' },
  { name: 'Uruguay', code: 'UYU', symbol: '$U' },
  { name: 'Uzbekistan', code: 'UZS', symbol: "so'm" },
  { name: 'Venezuela', code: 'VES', symbol: 'Bs.S' },
  { name: 'Vietnam', code: 'VND', symbol: '₫' },
  { name: 'Yemen', code: 'YER', symbol: '﷼' },
  { name: 'Zambia', code: 'ZMW', symbol: 'ZK' },
  { name: 'Zimbabwe', code: 'ZWL', symbol: '$' },
].sort((a, b) => a.name.localeCompare(b.name));

const FILTERED_COUNTRIES = COUNTRIES.filter(c => c.name !== 'Israel');
const POPULAR_COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'Europe'];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(FILTERED_COUNTRIES.find(c => c.name === 'India') || FILTERED_COUNTRIES[0]);

  const filteredList = useMemo(() => {
    if (!searchQuery) return FILTERED_COUNTRIES;
    return FILTERED_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 8) return;
    
    setIsSyncing(true);
    
    // Simulate high-performance Google Cloud lookup
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onLogin({
      mobileNumber: mobile,
      countryName: selectedCountry.name,
      currency: selectedCountry.code,
      currencySymbol: selectedCountry.symbol,
      isLoggedIn: true,
      syncEnabled: true
    });
    
    setIsSyncing(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center p-4 sm:p-10 font-sans">
      <div className="max-w-2xl w-full">
        {/* Branding */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-10 duration-700">
          <div className="bg-slate-900 w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-300 mb-6">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[3rem] p-8 sm:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-white animate-in fade-in zoom-in-95 duration-700 delay-100 relative overflow-hidden">
          {isSyncing && (
            <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="relative mb-6">
                 <div className="absolute inset-0 bg-indigo-100 rounded-full scale-[2.5] animate-pulse" />
                 <Cloud className="w-12 h-12 text-indigo-600 relative z-10" />
                 <Loader2 className="w-16 h-16 text-indigo-200 absolute -inset-2 animate-spin" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Syncing Cloud Profile</h3>
              <p className="text-sm text-slate-400 font-bold max-w-[240px]">Fetching your calculator data for {mobile} from Google Cloud...</p>
            </div>
          )}

          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Your Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mobile Input */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity (Mobile No.)</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] py-5 pl-16 pr-6 font-black text-slate-900 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-8 focus:ring-indigo-500/5 placeholder:text-slate-300 text-lg"
                  />
                </div>
              </div>

              {/* Region Selection */}
              <div className="space-y-5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Region & Currency</label>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">
                    {selectedCountry.code} ({selectedCountry.symbol})
                  </span>
                </div>

                {/* Quick Selection Toggle */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POPULAR_COUNTRIES.map(name => {
                    const country = FILTERED_COUNTRIES.find(c => c.name === name);
                    if (!country) return null;
                    const isSelected = selectedCountry.name === country.name;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedCountry(country)}
                        className={`py-3 rounded-xl text-[11px] font-black transition-all border-2 ${
                          isSelected 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                            : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                        }`}
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>

                {/* Search */}
                <div className="space-y-3 pt-2">
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search country list..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-[1.2rem] py-4 pl-12 pr-6 font-bold text-slate-600 outline-none transition-all focus:bg-white focus:border-indigo-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSyncing}
                className="w-full py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-[15px] uppercase tracking-[0.15em] shadow-2xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-indigo-100 disabled:opacity-50"
              >
                Launch & Sync
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Safe Private Environment</span>
          </div>
          <div className="hidden sm:block h-1 w-1 bg-slate-300 rounded-full" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Google Cloud Protected</p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
