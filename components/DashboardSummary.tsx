
import React from 'react';
import { MonthSummary, AppSettings } from '../types';
import { formatCurrency } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, Calendar, Clock, Zap, ArrowUpRight, TrendingUp, Download, MinusCircle, UserX, Briefcase } from 'lucide-react';

interface DashboardSummaryProps {
  summary: MonthSummary;
  settings: AppSettings;
  currentDate: Date;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary, settings, currentDate }) => {
  const chartData = [
    { name: 'Base Pay', value: summary.baseEarnings, color: '#4f46e5' },
    { name: 'Overtime', value: summary.otEarnings, color: '#f59e0b' },
    { name: 'Deductions', value: summary.absentDeduction, color: '#f43f5e' },
  ].filter(item => item.value > 0);

  const hasData = chartData.length > 0;
  const displayData = hasData ? chartData : [{ name: 'No Data', value: 1, color: '#f1f5f9' }];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = `Salary-Report-${monthName.replace(' ', '-')}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const StatCard = ({ icon: Icon, label, value, color, description, isNegative }: any) => (
    <div className="group bg-white p-4 sm:p-6 rounded-[1.8rem] sm:rounded-[2.2rem] border border-black/[0.01] shadow-[0_4px_25px_rgba(0,0,0,0.02)] transition-all duration-300 active:scale-[0.98]">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className={`p-2.5 sm:p-3.5 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <ArrowUpRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 sm:mb-1">{label}</p>
        <p className={`text-lg sm:text-2xl font-black leading-tight tracking-tight truncate ${isNegative ? 'text-rose-600' : 'text-slate-900'}`}>
          {isNegative && value.toString().includes(settings.currencySymbol) ? '-' : ''}{value}
        </p>
        <p className="hidden sm:block text-[10px] text-slate-400 font-bold mt-1.5 opacity-60 truncate">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Print-Only Header */}
      <div className="print-header hidden flex-row justify-between items-center mb-10 pb-5 border-b-2 border-slate-900">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
             <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">Earnings Report</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Employee ID: {settings.mobileNumber}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-black text-indigo-600 uppercase">{monthName}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country: {settings.countryName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard 
          icon={Calendar} 
          label="Present" 
          value={`${summary.presentDays} Days`} 
          description="Total work days"
          color="bg-emerald-600" 
        />
        <StatCard 
          icon={UserX} 
          label="Absent" 
          value={`${summary.absentDays} Days`} 
          description="Unpaid absence"
          color="bg-rose-500" 
        />
        <StatCard 
          icon={Clock} 
          label="Total OT" 
          value={`${summary.totalOtHours}h`} 
          description="Extra time logged"
          color="bg-amber-500" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="OT Bonus" 
          value={formatCurrency(summary.otEarnings, settings.currency)} 
          description="Earnings from OT"
          color="bg-amber-600" 
        />
        <StatCard 
          icon={MinusCircle} 
          label="Deduction" 
          value={formatCurrency(summary.absentDeduction, settings.currency)} 
          description="Absence penalty"
          color="bg-rose-600"
          isNegative={summary.absentDeduction > 0}
        />
        <StatCard 
          icon={Wallet} 
          label="Net Total" 
          value={formatCurrency(summary.totalEarnings, settings.currency)} 
          description="Final payout"
          color="bg-indigo-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] border border-black/[0.01] shadow-[0_15px_60px_rgba(0,0,0,0.02)] min-w-0 overflow-hidden relative">
          <div className="mb-6 relative z-10 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Income Structure</h3>
              <p className="text-[10px] sm:text-sm text-slate-400 font-bold uppercase tracking-widest mt-0.5">Monthly allocation breakdown</p>
          </div>
          
          <div className="h-[300px] sm:h-[400px] w-full min-w-0 relative flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Net Earnings</span>
              <span className="text-2xl sm:text-4xl font-black text-slate-900 tabular-nums">{formatCurrency(summary.totalEarnings, settings.currency)}</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayData}
                  cx="50%"
                  cy="50%"
                  innerRadius="70%"
                  outerRadius="95%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {displayData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '10px 14px',
                    fontWeight: 900,
                    fontSize: '11px'
                  }}
                  formatter={(value: number) => [formatCurrency(value, settings.currency), '']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  align="center"
                  iconType="circle"
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-4">
                      {payload?.map((entry: any, index: number) => (
                        <div key={`legend-${index}`} className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {entry.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-10">
                <div className="p-3 bg-white/10 rounded-[1rem] backdrop-blur-md">
                   <Zap className="w-5 h-5 text-indigo-300" />
                </div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Est. Payout</div>
              </div>

              <div className="mb-10 text-center sm:text-left">
                <p className="text-[11px] font-bold text-white/40 mb-1 uppercase tracking-widest">Final Net Total</p>
                <div className="text-4xl sm:text-5xl font-black tracking-tighter tabular-nums leading-tight">
                  {formatCurrency(summary.totalEarnings, settings.currency)}
                </div>
              </div>
              
              <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
                  <span className="text-white/40 font-bold">Base Pay</span>
                  <span className="font-black">{formatCurrency(summary.baseEarnings, settings.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
                  <span className="text-white/40 font-bold">OT Bonus</span>
                  <span className="font-black text-amber-400">+{formatCurrency(summary.otEarnings, settings.currency)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] sm:text-[14px]">
                  <span className="text-white/40 font-bold">Deduction</span>
                  <span className="font-black text-rose-400">-{formatCurrency(summary.absentDeduction, settings.currency)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2.5 bg-indigo-600 text-white py-5 rounded-[1.8rem] font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Download className="w-4 h-4" />
            Export {currentDate.toLocaleString('default', { month: 'short' })} PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
