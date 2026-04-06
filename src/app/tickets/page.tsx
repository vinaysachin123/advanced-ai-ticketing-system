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
