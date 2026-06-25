import { StateGraph, START, END, Annotation, MemorySaver } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createSearchTool } from './tools';
import type { IDay } from '@/types';

// ─── Model Setup ──────────────────────────────────────────────
function getLLM() {
  return new ChatGoogleGenerativeAI({
    model: 'gemini-2.5-flash',
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
  });
}

// ─── State Definition (Annotation API) ───────────────────────
const GraphAnnotation = Annotation.Root({
  origin: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  destination: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  budget: Annotation<number>({ reducer: (a, b) => b, default: () => 0 }),
  currency: Annotation<string>({ reducer: (a, b) => b, default: () => 'USD' }),
  preferences: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  startDate: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  endDate: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),

  messages: Annotation<string[]>({
    reducer: (existing, newMessages) => [...existing, ...newMessages],
    default: () => [],
  }),
  hotelData: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  flightData: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  restaurantData: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  attractionData: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  
  // Now supports parallel routing
  next: Annotation<string[]>({ reducer: (a, b) => b, default: () => [] }),
  humanFeedback: Annotation<string>({ reducer: (a, b) => b, default: () => '' }),
  finalItinerary: Annotation<IDay[] | null>({ reducer: (a, b) => b, default: () => null }),
});

export type GraphState = typeof GraphAnnotation.State;

// ─── Supervisor Agent ──────────────────────────────────────────
async function supervisorAgent(state: GraphState): Promise<Partial<GraphState>> {
  // Optimized: Removed LLM call here to save massive API quotas and speed up execution.
  // The supervisor is now a deterministic router that launches agents in parallel!
  
  if (state.humanFeedback && state.finalItinerary) {
    return { next: ['draftAgent'], messages: ['👨‍💼 Supervisor: Human feedback received, sending to Draft Agent.'] };
  }

  const tasks: string[] = [];
  if (!state.hotelData) tasks.push('hotelAgent');
  if (!state.flightData) tasks.push('flightAgent');
  if (!state.restaurantData) tasks.push('restaurantAgent');
  if (!state.attractionData) tasks.push('attractionAgent');

  if (tasks.length > 0) {
    return { next: tasks, messages: [`👨‍💼 Supervisor routing to: ${tasks.join(', ')} in parallel`] };
  }

  if (!state.finalItinerary) {
    return { next: ['draftAgent'], messages: ['👨‍💼 Supervisor routing to: draftAgent'] };
  }

  return { next: ['humanReview'], messages: ['👨‍💼 Supervisor routing to: humanReview'] };
}

// ─── Worker Agent Helpers ─────────────────────────────────────
async function runSearch(query: string, fallbackPrompt: string): Promise<string> {
  const searchTool = createSearchTool();
  if (searchTool) {
    try {
      const res = await searchTool.invoke({ query });
      return typeof res === 'string' ? res : JSON.stringify(res);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }
  // Fallback to LLM knowledge if no Tavily API key
  const llm = getLLM();
  const res = await llm.invoke([new HumanMessage(fallbackPrompt)]);
  return res.content as string;
}

// ─── Hotel Agent ───────────────────────────────────────────────
async function hotelAgent(state: GraphState): Promise<Partial<GraphState>> {
  const query = `best hotels in ${state.destination} budget ${state.budget} ${state.currency}`;
  const data = await runSearch(query, `List 3 budget hotels in ${state.destination} within ${state.budget} ${state.currency}. Be extremely concise.`);
  return { hotelData: data, messages: ['🏨 Hotel Agent completed research.'] };
}

// ─── Flight Agent ──────────────────────────────────────────────
async function flightAgent(state: GraphState): Promise<Partial<GraphState>> {
  const query = `flights from ${state.origin || 'anywhere'} to ${state.destination} around ${state.startDate}`;
  const data = await runSearch(query, `Estimate concise flight options from ${state.origin} to ${state.destination}.`);
  return { flightData: data, messages: ['✈️ Flight Agent completed research.'] };
}

// ─── Restaurant Agent ──────────────────────────────────────────
async function restaurantAgent(state: GraphState): Promise<Partial<GraphState>> {
  const query = `popular budget restaurants and local food in ${state.destination}`;
  const data = await runSearch(query, `Recommend 3 local budget restaurants in ${state.destination}. Be concise.`);
  return { restaurantData: data, messages: ['🍽️ Restaurant Agent completed research.'] };
}

// ─── Attraction Agent ──────────────────────────────────────────
async function attractionAgent(state: GraphState): Promise<Partial<GraphState>> {
  const query = `top tourist attractions things to do in ${state.destination} preferences: ${state.preferences}`;
  const data = await runSearch(query, `List 4 top tourist attractions in ${state.destination} fitting: ${state.preferences}. Be concise.`);
  return { attractionData: data, messages: ['🎢 Attraction Agent completed research.'] };
}

// ─── Draft Agent (Itinerary Compiler) ─────────────────────────
async function draftAgent(state: GraphState): Promise<Partial<GraphState>> {
  const llm = getLLM();
  const numDays = Math.max(1, Math.ceil((new Date(state.endDate).getTime() - new Date(state.startDate).getTime()) / (1000 * 60 * 60 * 24)));

  let prompt = `Create a ${numDays}-day travel itinerary for ${state.destination} (from ${state.origin}).\n` +
    `Budget: ${state.budget} ${state.currency}\n` +
    `Dates: ${state.startDate} to ${state.endDate}\n` +
    `Preferences: ${state.preferences}\n\n` +
    `[Hotel]: ${state.hotelData.substring(0, 500)}\n[Flight]: ${state.flightData.substring(0, 500)}\n` +
    `[Food]: ${state.restaurantData.substring(0, 500)}\n[Attractions]: ${state.attractionData.substring(0, 500)}\n\n`;

  if (state.humanFeedback && state.finalItinerary) {
    prompt += `HUMAN FEEDBACK:\n"${state.humanFeedback}"\n\nUpdate previous itinerary!\n`;
  }

  prompt += `Return ONLY a valid JSON array of Day objects. EXACT structure:
[
  {
    "dayNumber": 1,
    "date": "YYYY-MM-DD",
    "title": "Arrival",
    "activities": [
      { "time": "10:00 AM", "location": "Location", "description": "Desc", "estimatedCost": 50, "category": "activity" }
    ]
  }
]
Category must be: accommodation, food, activity, transport.`;

  const result = await llm.invoke([
    new SystemMessage('You are an expert itinerary compiler. You output ONLY valid JSON arrays without markdown block syntax.'),
    new HumanMessage(prompt),
  ]);

  let finalItinerary: IDay[] | null = null;
  try {
    let content = result.content as string;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) finalItinerary = JSON.parse(jsonMatch[0]);
    else finalItinerary = JSON.parse(content);
  } catch (err) {
    console.error('[draftAgent] Parse failed', err);
    finalItinerary = [];
  }

  return { 
    finalItinerary, 
    humanFeedback: '', 
    messages: ['📋 Draft Agent compiled the itinerary! Waiting for human review...'] 
  };
}

// ─── Conditional Routing ──────────────────────────────────────
function routeFromSupervisor(state: GraphState): string[] {
  return state.next;
}

// ─── Build & Export the Graph ─────────────────────────────────
function buildGraph() {
  const checkpointer = new MemorySaver(); // For HITL persistency
  
  const graph = new StateGraph(GraphAnnotation)
    .addNode('supervisorAgent', supervisorAgent)
    .addNode('hotelAgent', hotelAgent)
    .addNode('flightAgent', flightAgent)
    .addNode('restaurantAgent', restaurantAgent)
    .addNode('attractionAgent', attractionAgent)
    .addNode('draftAgent', draftAgent)
    
    // Start at the supervisor
    .addEdge(START, 'supervisorAgent')
    
    // Supervisor dynamically routes to agents in parallel!
    .addConditionalEdges('supervisorAgent', routeFromSupervisor, {
      hotelAgent: 'hotelAgent',
      flightAgent: 'flightAgent',
      restaurantAgent: 'restaurantAgent',
      attractionAgent: 'attractionAgent',
      draftAgent: 'draftAgent',
      humanReview: END,
    })
    
    // Workers always report back to supervisor
    .addEdge('hotelAgent', 'supervisorAgent')
    .addEdge('flightAgent', 'supervisorAgent')
    .addEdge('restaurantAgent', 'supervisorAgent')
    .addEdge('attractionAgent', 'supervisorAgent')
    .addEdge('draftAgent', 'supervisorAgent');

  return graph.compile({ checkpointer });
}

export const tripPlannerGraph = buildGraph();
