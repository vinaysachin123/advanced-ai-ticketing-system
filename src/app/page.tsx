import prisma from '@/lib/prisma';
import { Ticket, Activity, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const tickets = await prisma.ticket.findMany({
    include: { department: true }
  });

  const openTickets = tickets.filter(t => !["Resolved", "Closed"].includes(t.status));
  const resolvedTickets = tickets.filter(t => t.status === "Resolved");
  const autoResolvedTickets = tickets.filter(t => t.resolutionPath === "Auto-resolve");
  const escalatedTickets = tickets.filter(t => ["Critical", "High"].includes(t.severity!) && t.status === "New");

  const autoResSuccess = autoResolvedTickets.filter(t => t.userFeedbackIsHelpful === true).length;
  const autoResTotal = autoResolvedTickets.filter(t => t.userFeedbackIsHelpful !== null).length;
  const autoResRate = autoResTotal > 0 ? Math.round((autoResSuccess / autoResTotal) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Analytics</h1>
        <p className="text-slate-500 mt-1 font-medium">Real-time overview of your ticketing platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-bold">{openTickets.length}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Open Tickets</div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-bold">{resolvedTickets.length}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Resolved</div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl shadow-inner">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-bold">{autoResolvedTickets.length}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Auto-Resolved</div>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center space-x-4 border-rose-200 dark:border-rose-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-rose-500">
            <AlertCircle className="w-24 h-24 -mt-4 -mr-4" />
          </div>
          <div className="p-4 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-2xl shadow-inner relative z-10">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="relative z-10">
            <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">{escalatedTickets.length}</div>
            <div className="text-sm font-semibold text-rose-600/80 uppercase tracking-wider">Escalated Risk</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-4">Auto-Resolution Success Rate</h2>
          <div className="flex items-center space-x-8">
            <div className="relative h-32 w-32 flex-shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="stroke-slate-200 dark:stroke-slate-700"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                  strokeDasharray="100, 100"
                />
                <path
                  className="stroke-blue-500 animate-pulse"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  strokeWidth="3.5"
                  strokeDasharray={`${autoResRate}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{autoResRate}%</span>
              </div>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                This metric represents the percentage of automatically resolved tickets that users marked as helpful.
              </p>
              <div className="flex space-x-4">
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-emerald-500">{autoResSuccess}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Helpful</span>
                </div>
                <div className="flex flex-col border-l border-slate-200 dark:border-slate-700 pl-4">
                  <span className="text-xl font-bold">{autoResTotal}</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase">Total Rated</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Recent Priority Tickets</h2>
            <Link href="/tickets" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          <div className="space-y-4">
            {openTickets.slice(0, 4).map(ticket => (
              <div key={ticket.id} className="flex justify-between items-center p-4 bg-slate-50/80 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">{ticket.title}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{ticket.department?.name || 'Unassigned'} • {ticket.category}</div>
                </div>
                <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase rounded-lg">
                  {ticket.severity}
                </div>
              </div>
            ))}
            {openTickets.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No open priority tickets! Awesome job.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
