import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tripPlannerGraph, type GraphState } from '@/lib/agent/tripPlannerGraph';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();

  const sendEvent = (
    controller: ReadableStreamDefaultController,
    type: string,
    message: string,
    data?: unknown
  ) => {
    const payload = JSON.stringify({ type, message, data });
    controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
  };

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
          sendEvent(controller, 'error', 'Unauthorized — please log in first');
          controller.close();
          return;
        }

        const body = await request.json();
        const { thread_id, action, feedback, tripDetails } = body;

        if (!thread_id || !action || !tripDetails) {
          sendEvent(controller, 'error', 'Missing thread ID, action, or trip details');
          controller.close();
          return;
        }

        const config = { configurable: { thread_id } };

        if (action === 'APPROVE') {
          sendEvent(controller, 'status', `✅ Saving finalized itinerary...`);
          
          // Calculate total cost
          const totalEstimatedCost = tripDetails.draft.reduce((total: number, day: any) => {
            return total + day.activities.reduce((dayTotal: number, act: any) => dayTotal + (act.estimatedCost || 0), 0);
          }, 0);

          const trip = await prisma.trip.create({
            data: {
              userId: session.user.id,
              origin: tripDetails.origin || 'Unknown',
              destination: tripDetails.destination,
              budget: Number(tripDetails.budget),
              currency: tripDetails.currency || 'USD',
              startDate: new Date(tripDetails.startDate),
              endDate: new Date(tripDetails.endDate),
              preferences: tripDetails.preferences || '',
              itinerary: JSON.stringify(tripDetails.draft),
              totalEstimatedCost,
              status: 'FINALIZED',
            }
          });

          sendEvent(controller, 'complete', '✅ Your itinerary is saved!', {
            tripId: trip.id,
          });
          controller.close();
          return;
        } 
        
        if (action === 'REJECT') {
          if (!feedback) {
            sendEvent(controller, 'error', 'Feedback is required to regenerate.');
            controller.close();
            return;
          }

          sendEvent(controller, 'status', `🔄 Processing your feedback...`);

          const agentStream = await tripPlannerGraph.stream(
            { humanFeedback: feedback },
            { ...config, streamMode: 'values' }
          );

          let finalState: GraphState | null = null;
          for await (const state of agentStream) {
            finalState = state as GraphState;
            if (finalState.messages && finalState.messages.length > 0) {
              const latestMsg = finalState.messages[finalState.messages.length - 1];
              sendEvent(controller, 'status', latestMsg);
            }
          }

          if (finalState?.finalItinerary) {
            sendEvent(controller, 'humanReview', 'Waiting for human approval', {
              draft: finalState.finalItinerary,
              thread_id,
              ...tripDetails
            });
          } else {
            sendEvent(controller, 'error', 'Agent failed to revise the itinerary.');
          }

          controller.close();
        }

      } catch (error) {
        console.error('[plan-trip/resume API] Error:', error);
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        sendEvent(controller, 'error', `❌ Error: ${message}`);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
