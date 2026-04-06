'use client';

import { useState, useTransition } from 'react';
import { submitTicket, submitFeedback } from '@/actions/ticketActions';
import { Sparkles, Send, CheckCircle2, Bot } from 'lucide-react';
import Link from 'next/link';

export default function NewTicketPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success?: boolean; error?: string; autoResolved?: boolean; ticketId?: string } | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await submitTicket(formData);
      setResult(res);
      setFeedbackGiven(false);
    });
  };

  const handleFeedback = (isHelpful: boolean) => {
    if (result?.ticketId) {
      submitFeedback(result.ticketId, isHelpful);
      setFeedbackGiven(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 animate-slideDown">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-slate-500 mt-2 font-medium">Our AI assistant will analyze and triage your request instantly.</p>
      </div>

      {result?.success ? (
        <div className="glass-card p-8 text-center animate-fadeIn">
          {result.autoResolved ? (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                <Bot className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Issue Auto-Resolved!</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Our AI was able to handle your request immediately. Please check the ticket details in your dashboard or read the response there. (In a full app, the response would be shown here directly).
              </p>
              
              {!feedbackGiven ? (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Was this AI resolution helpful?</p>
                  <div className="flex justify-center space-x-4">
                    <button onClick={() => handleFeedback(true)} className="btn-secondary flex items-center text-emerald-600 dark:text-emerald-400 hover:border-emerald-300">
                      👍 Yes, thanks
                    </button>
                    <button onClick={() => handleFeedback(false)} className="btn-secondary flex items-center text-rose-600 dark:text-rose-400 hover:border-rose-300">
                      👎 No, I need human help
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 font-medium text-emerald-600">
                  Thank you for your feedback! It helps improve our AI.
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="mx-auto w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ticket Submitted Successfully</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Your ticket has been analyzed and intelligently routed to the best available employee.
              </p>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex space-x-4 justify-center">
            <button onClick={() => setResult(null)} className="btn-secondary">Submit Another</button>
            <Link href="/tickets" className="btn-primary">View My Tickets</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6 relative overflow-hidden">
          {/* Decorative Sparkles */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500 pointer-events-none">
            <Sparkles className="w-48 h-48 -mr-16 -mt-16" />
          </div>

          {result?.error && (
            <div className="p-4 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 rounded-xl font-medium text-sm">
              {result.error}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Issue Title</label>
            <input 
              required
              id="title"
              name="title"
              placeholder="e.g. Cannot access VPN, Requesting leave" 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Detailed Description</label>
            <textarea 
              required
              id="description"
              name="description"
              rows={5}
              placeholder="Please provide all relevant details so our AI can help you faster..." 
              className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isPending}
              className={`w-full ${isPending ? 'opacity-70 cursor-not-allowed' : ''} btn-primary shadow-indigo-500/30 text-lg py-4`}
            >
              {isPending ? (
                <>
                  <Sparkles className="animate-spin w-5 h-5 mr-3" />
                  AI Triage in Progress...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-3" />
                  Submit to AI Assistant
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
