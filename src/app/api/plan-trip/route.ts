import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { tripPlannerGraph, type GraphState } from '@/lib/agent/tripPlannerGraph';
import { v4 as uuidv4 } from 'uuid';

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
        const { origin, destination, budget, currency, startDate, endDate, preferences } = body;

        if (!destination || !budget || !startDate || !endDate) {
          sendEvent(controller, 'error', 'Missing required fields');
          controller.close();
          return;
        }

        sendEvent(controller, 'status', `🌍 Dispatching Multi-Agent Team for ${destination}...`);

        const initialState: GraphState = {
          origin: origin || '',
          destination,
          budget: Number(budget),
          currency: currency || 'USD',
          preferences: preferences || '',
          startDate,
          endDate,
          hotelData: '',
          flightData: '',
          restaurantData: '',
          attractionData: '',
          next: [],
          humanFeedback: '',
          finalItinerary: null,
          messages: [],
        };

        const thread_id = uuidv4();
        const config = { configurable: { thread_id } };

        let finalState: GraphState | null = null;

        const agentStream = await tripPlannerGraph.stream(initialState, {
          ...config,
          streamMode: 'values',
        });

        for await (const state of agentStream) {
          finalState = state as GraphState;

          if (finalState.messages && finalState.messages.length > 0) {
            const latestMsg = finalState.messages[finalState.messages.length - 1];
            sendEvent(controller, 'status', latestMsg);
          }
        }

        if (finalState?.finalItinerary) {
          // HITL Phase: Send the draft to the frontend to wait for human review
          sendEvent(controller, 'humanReview', 'Waiting for human approval', {
            draft: finalState.finalItinerary,
            thread_id,
            destination,
            budget,
            currency,
            startDate,
            endDate,
            preferences
          });
        } else {
          sendEvent(controller, 'error', 'Agent failed to generate an itinerary.');
        }

        controller.close();
      } catch (error) {
        console.error('[plan-trip API] Error:', error);
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
