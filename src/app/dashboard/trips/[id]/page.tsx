import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TripViewClient } from '@/components/TripViewClient';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({ where: { id } });
  
  if (!trip) return { title: 'Trip Not Found' };
  
  return {
    title: `${trip.destination} Itinerary`,
    description: `AI-generated ${trip.destination} travel itinerary`,
  };
}

export default async function TripViewPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;

  const dbTrip = await prisma.trip.findUnique({
    where: { id }
  });

  if (!dbTrip || dbTrip.userId !== session.user.id) notFound();

  // Parse itinerary from JSON string
  const trip = {
    ...dbTrip,
    itinerary: JSON.parse(dbTrip.itinerary)
  };

  return <TripViewClient initialTrip={trip} />;
}
