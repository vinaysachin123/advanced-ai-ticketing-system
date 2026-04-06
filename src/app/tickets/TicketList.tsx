'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, Clock, CheckCircle2, ChevronRight, Activity, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { processAction } from '@/actions/ticketActions';

export default function TicketList({ initialTickets }: { initialTickets: any[] }) {
  const router = useRouter();
  const [tickets, setTickets] = useState(initialTickets);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    setTickets(initialTickets);
  }, [initialTickets]);

  const filteredTickets = tickets.filter(t => {
    if (filter !== 'All' && t.status !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.category?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'Critical': return <ArrowUpRight className="w-4 h-4 text-rose-500" />;
      case 'High': return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'Medium': return <Minus className="w-4 h-4 text-amber-500" />;
      default: return <ArrowDownRight className="w-4 h-4 text-emerald-500" />;
    }
  };

  const statusColors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'Assigned': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'In Progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'Pending Info': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    'Resolved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Closed': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tickets by title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {['All', 'New', 'Assigned', 'In Progress', 'Resolved'].map(stat => (
            <button 
              key={stat}
              onClick={() => setFilter(stat)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${filter === stat ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}`}
            >
              {stat}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTickets.map(ticket => (
          <div key={ticket.id} className="glass-card hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 overflow-hidden cursor-pointer group">
            <div className="p-5 flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                    <div className="flex items-center text-sm text-slate-500 space-x-3 font-medium">
                      <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {formatDistanceToNow(new Date(ticket.createdAt), {addSuffix: true})}</span>
                      <span>•</span>
                      <span>{ticket.department?.name || 'No Dept'}</span>
                      <span>•</span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs">{ticket.category}</span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold leading-tight ${statusColors[ticket.status]}`}>
                    {ticket.status}
                  </div>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed">
                  {ticket.description}
                </p>

                {ticket.aiSummary && (
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl text-sm">
                    <div className="flex items-center text-blue-700 dark:text-blue-400 font-bold mb-1 text-xs uppercase tracking-wider">
                      <Activity className="w-3.5 h-3.5 mr-1.5" /> AI Analysis
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 italic">{ticket.aiSummary}</p>
                  </div>
                )}
              </div>

              <div className="w-full md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-700/50 pt-4 md:pt-0 md:pl-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</div>
                    <div className="flex items-center font-medium text-slate-800 dark:text-slate-200">
                      {ticket.assignee ? (
                        <>
                          <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold mr-2">
                            {ticket.assignee.name.charAt(0)}
                          </div>
                          {ticket.assignee.name}
                        </>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Severity</div>
                    <div className="flex items-center font-medium text-slate-800 dark:text-slate-200">
                      {getSeverityIcon(ticket.severity)}
                      <span className="ml-1.5">{ticket.severity}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:underline">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          </div>
        ))}
        {filteredTickets.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-medium">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            No tickets found.
          </div>
        )}
      </div>
    </div>
  );
}
