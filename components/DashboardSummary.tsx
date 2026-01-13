
import React, { useState } from 'react';
import { MonthSummary, AppSettings } from '../types';
import { formatCurrency } from '../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Wallet, Calendar, Clock, TrendingUp, Download, MinusCircle, UserX, Loader2, FileSpreadsheet, Check } from 'lucide-react';

interface DashboardSummaryProps {
  summary: MonthSummary;
  settings: AppSettings;
  currentDate: Date;
}

declare global {
  interface Window {
    XLSX: any;
  }
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ summary, settings, currentDate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const chartData = [
    { name: 'Base Pay', value: summary.baseEarnings, color: '#4f46e5' },
    { name: 'Overtime', value: summary.otEarnings, color: '#f59e0b' },
    { name: 'Deductions', value: Math.abs(summary.absentDeduction), color: '#f43f5e' },
  ].filter(item => item.value > 0);

  const hasData = chartData.length > 0;
  const displayData = hasData ? chartData : [{ name: 'No Data', value: 1, color: '#1e293b' }];

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const handleExportExcel = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    
    try {
      const XLSX = window.XLSX;
      if (!XLSX) throw new Error("Excel library not loaded");

      // Calculate Rates for transparency in the report
      const dailyRate = settings.monthlySalary / (settings.workingDaysPerMonth || 1);
      const hourlyRate = dailyRate / (settings.workingHoursPerDay || 1);
      const effectiveOtRate = settings.otRateMode === 'auto' ? hourlyRate : settings.manualOtRate;

      const fileName = `Salary_Report_${monthName.replace(/\s/g, '_')}_${settings.mobileNumber}.xlsx`;
      
      // Structured Data Rows
      const data = [
        ["PAYSLIP & ATTENDANCE REPORT"],
        [monthName.toUpperCase()],
        [""],
        ["EMPLOYEE INFORMATION"],
        ["Employee ID", settings.mobileNumber],
        ["Region", settings.countryName],
        ["Currency", `${settings.currency} (${settings.currencySymbol})`],
        ["Report Generated", new Date().toLocaleString()],
        [""],
        ["ATTENDANCE SUMMARY"],
        ["Metric", "Quantity", "Unit", "Rate Per Unit", "Subtotal"],
        ["Present Days", summary.presentDays, "Days", dailyRate.toFixed(2), (summary.presentDays * dailyRate).toFixed(2)],
        ["Absent Days", summary.absentDays, "Days", dailyRate.toFixed(2), (-summary.absentDeduction).toFixed(2)],
        ["Overtime", summary.totalOtHours, "Hours", effectiveOtRate.toFixed(2), summary.otEarnings.toFixed(2)],
        [""],
        ["PAYROLL BREAKDOWN"],
        ["Description", "Amount", "Details"],
        ["Monthly Base Salary", summary.baseEarnings.toFixed(2), `Based on ${settings.workingDaysPerMonth} days/mo`],
        ["OT Earnings", summary.otEarnings.toFixed(2), `${summary.totalOtHours}h @ ${effectiveOtRate.toFixed(2)}/hr`],
        ["Absence Deductions", (-summary.absentDeduction).toFixed(2), `${summary.absentDays} days @ ${dailyRate.toFixed(2)}/day`],
        [""],
        ["", "ESTIMATED NET TOTAL", `${settings.currencySymbol} ${summary.totalEarnings.toFixed(2)}`],
        [""],
        ["--- End of Official Report ---"]
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Add column widths for better design
      ws['!cols'] = [
        { wch: 25 }, // A: Description
        { wch: 20 }, // B: Amount/Qty
        { wch: 15 }, // C: Unit/Detail
        { wch: 20 }, // D: Rate
        { wch: 20 }  // E: Subtotal
      ];

      // Merge header cells for a designed look
      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }, // Title
        { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } }, // Month
        { s: { r: 21, c: 1 }, e: { r: 21, c: 1 } } // Net Total label
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Monthly Summary");
      XLSX.writeFile(wb, fileName);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Export failed. Please check if the Excel library is loaded.');
    } finally {
      setIsGenerating(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, isNegative }: any) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-[1.8rem] border border-slate-100 dark:border-white/[0.05] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-colors duration-500">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-4 h-4 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-xl font-black leading-tight tracking-tight ${isNegative ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'}`}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="summary-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatCard icon={Calendar} label="Present" value={`${summary.presentDays} Days`} color="bg-emerald-600" />
        <StatCard icon={UserX} label="Absent" value={`${summary.absentDays} Days`} color="bg-rose-500" />
        <StatCard icon={Clock} label="Total OT" value={`${summary.totalOtHours}h`} color="bg-amber-500" />
        <StatCard icon={TrendingUp} label="OT Bonus" value={formatCurrency(summary.otEarnings, settings.currency)} color="bg-amber-600" />
        <StatCard icon={MinusCircle} label="Deduction" value={formatCurrency(-Math.abs(summary.absentDeduction), settings.currency)} color="bg-rose-600" isNegative={summary.absentDeduction > 0} />
        <StatCard icon={Wallet} label="Net Total" value={formatCurrency(summary.totalEarnings, settings.currency)} color="bg-indigo-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100 dark:border-white/[0.05] relative overflow-hidden transition-colors duration-500">
          <div className="mb-8 relative z-10 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Earnings Allocation</h3>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest mt-0.5">Statistical breakdown</p>
          </div>
          <div className="h-[350px] sm:h-[400px] w-full relative flex items-center justify-center">
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Net Payout</span>
              <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tabular-nums">{formatCurrency(summary.totalEarnings, settings.currency)}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={displayData} cx="50%" cy="50%" innerRadius="72%" outerRadius="95%" paddingAngle={6} dataKey="value" stroke="none" isAnimationActive={false}>
                  {displayData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 bg-slate-900 dark:bg-black p-8 sm:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden min-h-[420px]">
            <div className="relative z-10 h-full flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <div className="p-3.5 bg-white/10 rounded-2xl"><FileSpreadsheet className="w-5 h-5 text-indigo-300" /></div>
                <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Summary</div>
              </div>
              <div className="mb-12">
                <p className="text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Estimated Net Payout</p>
                <div className="text-4xl sm:text-5xl font-black tabular-nums">{formatCurrency(summary.totalEarnings, settings.currency)}</div>
              </div>
              <div className="mt-auto space-y-6 pt-10 border-t border-white/10">
                <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-[12px] uppercase">Basic Pay</span><span className="font-black text-[16px]">{formatCurrency(summary.baseEarnings, settings.currency)}</span></div>
                <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-[12px] uppercase">Overtime</span><span className="font-black text-[16px] text-amber-400">+{formatCurrency(summary.otEarnings, settings.currency)}</span></div>
                <div className="flex justify-between items-center"><span className="text-white/40 font-bold text-[12px] uppercase">Absences</span><span className="font-black text-[16px] text-rose-400">-{formatCurrency(summary.absentDeduction, settings.currency)}</span></div>
              </div>
            </div>
          </div>
          <button disabled={isGenerating} onClick={handleExportExcel} className={`w-full flex items-center justify-center gap-3 py-6 rounded-3xl font-black text-[13px] uppercase shadow-xl ${showSuccess ? 'bg-emerald-600' : 'bg-indigo-600 dark:bg-indigo-700'} text-white transition-all`}>
            {isGenerating ? <Loader2 className="animate-spin w-5 h-5" /> : showSuccess ? <Check className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
            {isGenerating ? 'Processing...' : showSuccess ? 'Ready!' : 'Export Excel'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
