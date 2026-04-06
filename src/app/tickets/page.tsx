import prisma from '@/lib/prisma';
import TicketList from './TicketList';

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  let tickets: any[] = [];
  try {
    tickets = await prisma.ticket.findMany({
      include: {
        department: true,
        assignee: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (e) {
    console.error("Vercel DB error:", e);
    // VERCEL MOCK DATA FALLBACK
    tickets = [
      { id: '1', title: 'Cannot access VPN', description: 'Trying to work remote but VPN is disconnected.', category: 'Access', severity: 'High', status: 'Assigned', department: { name: 'IT' }, assignee: { name: 'Diana Prince' }, aiSummary: 'User is locked out of the company virtual private network.', resolutionPath: 'Assign to department', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Forgot my password map', description: 'Need password reset.', category: 'Access', severity: 'Low', status: 'Resolved', department: { name: 'IT' }, assignee: null, aiSummary: 'Standard password reset request.', resolutionPath: 'Auto-resolve', userFeedbackIsHelpful: true, createdAt: new Date(Date.now() - 3600000), updatedAt: new Date() },
      { id: '3', title: 'Production Database is crashing!', description: 'We are losing money queries are timing out!', category: 'DB', severity: 'Critical', status: 'New', department: { name: 'Engineering' }, assignee: null, aiSummary: 'Production database latency is critical.', resolutionPath: 'Assign to department', createdAt: new Date(Date.now() - 7200000), updatedAt: new Date() },
      { id: '4', title: 'Maternity leave blocks', description: 'How do I apply for leave next quarter?', category: 'HR', severity: 'Medium', status: 'Assigned', department: { name: 'HR' }, assignee: { name: 'Eve Davis' }, aiSummary: 'Inquiry regarding human resources leave application policies.', resolutionPath: 'Assign to department', createdAt: new Date(Date.now() - 86400000), updatedAt: new Date() },
    ];
  }

  return (
    <div className="animate-slideDown">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ticket Lifecycle Management</h1>
        <p className="text-slate-500 mt-1 font-medium">Monitor, route, and resolve technical issues.</p>
      </div>
      <TicketList initialTickets={tickets} />
    </div>
  );
}
