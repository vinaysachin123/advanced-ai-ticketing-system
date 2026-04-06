import prisma from '@/lib/prisma';
import { Mail, Briefcase, Activity, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    include: {
      department: true
    },
    orderBy: {
      department: { name: 'asc' }
    }
  });

  return (
    <div className="space-y-8 animate-slideDown">
      <div className="flex justify-between items-center bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-slate-500 mt-1 font-medium">Browse load and availability across all departments</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-bold flex items-center shadow-inner">
          <UsersIcon className="w-5 h-5 mr-2" />
          {employees.length} Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((emp) => (
          <div key={emp.id} className="glass-card hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            <div className="p-6 relative text-sm">
              {emp.availability === 'Available' ? (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-sm border border-white"></span>
                </span>
              ) : emp.availability === 'Busy' ? (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-sm border border-white"></span>
                </span>
              ) : (
                <span className="absolute top-4 right-4 flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-300 shadow-sm border border-white"></span>
                </span>
              )}
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-blue-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-400 shadow-inner ring-4 ring-white dark:ring-slate-800">
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{emp.name}</h3>
                  <div className="text-slate-500 font-medium">{emp.role}</div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Briefcase className="w-4 h-4 mr-3 opacity-70" />
                  <span className="font-semibold">{emp.department?.name}</span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Mail className="w-4 h-4 mr-3 opacity-70" />
                  <span>{emp.email}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {emp.skillTags.split(',').map((skill) => (
                    <span key={skill} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-700/50 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
                  <Activity className="w-5 h-5 mr-1.5 text-blue-500" />
                  {emp.currentLoad}
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Ticket Load</div>
              </div>
              <div className="text-center border-l border-slate-200 dark:border-slate-700">
                <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-1.5 text-indigo-500" />
                  {emp.averageResolutionTime}m
                </div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Avg Resolv</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
