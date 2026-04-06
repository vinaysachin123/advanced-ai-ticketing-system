import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { LayoutDashboard, Users, Ticket, PlusCircle } from 'lucide-react';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Advanced AI Ticketing System",
  description: "Smart internal ticketing platform powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex bg-slate-50 dark:bg-slate-900`}>
        
        {/* Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
          <div className="h-full flex flex-col pt-8 pb-4">
            <div className="px-6 mb-8">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                AI Tickets
              </h1>
            </div>
            
            <nav className="flex-1 space-y-2 px-4">
              <Link href="/" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <LayoutDashboard className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Dashboard</span>
              </Link>
              
              <Link href="/tickets" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <Ticket className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Tickets</span>
              </Link>
              
              <Link href="/employees" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                <Users className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                <span className="font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Directory</span>
              </Link>
            </nav>

            <div className="px-4 mt-auto">
              <Link href="/new-ticket" className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all">
                <PlusCircle className="w-5 h-5" />
                <span className="font-semibold">New Ticket</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="h-16 flex-shrink-0 flex items-center px-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
            {/* Topbar config/branding could go here */}
            <div className="flex-1" />
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-sm" />
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-8 animate-fadeIn">
            <div className="max-w-6xl mx-auto h-full">
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
