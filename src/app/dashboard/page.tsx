import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { DashboardClient } from '@/components/DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View and manage your AI-generated travel itineraries',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const dbTrips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  });

  const trips = dbTrips.map(trip => ({
    ...trip,
    status: trip.status as 'DRAFT' | 'FINALIZED',
    itinerary: JSON.parse(trip.itinerary)
  }));

  return <DashboardClient trips={trips} userName={session.user.name || 'Traveler'} />;
}
