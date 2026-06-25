import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { IDay } from '@/types';

export const maxDuration = 60;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { dayNumber } = await request.json();

    const trip = await prisma.trip.findUnique({
      where: { id }
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 404 });
    }

    const itinerary: IDay[] = JSON.parse(trip.itinerary);

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      temperature: 0.8,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const dayToRegenerate = itinerary.find((d: IDay) => d.dayNumber === dayNumber);
    if (!dayToRegenerate) {
      return NextResponse.json({ error: 'Day not found' }, { status: 404 });
    }

    const result = await llm.invoke([
      new SystemMessage(
        'You are a creative travel planner. Generate DIFFERENT activities than the ones provided. ' +
        'Return valid JSON only — a single Day object, no markdown.'
      ),
      new HumanMessage(
        `Regenerate Day ${dayNumber} of a trip to ${trip.destination}.\n` +
        `Budget per day: ${Math.floor(trip.budget / itinerary.length)} ${trip.currency}\n` +
        `Date: ${dayToRegenerate.date}\n` +
        `Preferences: ${trip.preferences || 'general sightseeing'}\n` +
        `Current activities (please replace with DIFFERENT ones):\n${JSON.stringify(dayToRegenerate.activities, null, 2)}\n\n` +
        `Return JSON:\n` +
        `{\n` +
        `  "dayNumber": ${dayNumber},\n` +
        `  "date": "${dayToRegenerate.date}",\n` +
        `  "title": "New Day Title",\n` +
        `  "activities": [...]\n` +
        `}`
      ),
    ]);

    let newDay: IDay | null = null;
    try {
      const content = result.content as string;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        newDay = JSON.parse(jsonMatch[0]);
      }
    } catch {
      return NextResponse.json({ error: 'Failed to parse regenerated day' }, { status: 500 });
    }

    // Update the specific day in the itinerary
    const updatedItinerary = itinerary.map((d: IDay) =>
      d.dayNumber === dayNumber ? newDay : d
    );

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: {
        itinerary: JSON.stringify(updatedItinerary),
      }
    });

    return NextResponse.json({ 
      trip: {
        ...updatedTrip,
        itinerary: JSON.parse(updatedTrip.itinerary)
      } 
    });
  } catch (error) {
    console.error('[POST /api/trips/[id]/regenerate-day]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
