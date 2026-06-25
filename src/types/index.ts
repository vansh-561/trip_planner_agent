// ─── Activity ────────────────────────────────────────────────
export interface IActivity {
  time: string;
  location: string;
  description: string;
  estimatedCost: number;
  category: 'accommodation' | 'food' | 'activity' | 'transport';
}

// ─── Day ─────────────────────────────────────────────────────
export interface IDay {
  dayNumber: number;
  date: string;
  title: string;
  activities: IActivity[];
}

// ─── Agent State ─────────────────────────────────────────────
export interface AgentState {
  origin: string;
  destination: string;
  budget: number;
  currency: string;
  preferences: string;
  startDate: string;
  endDate: string;
  researchData: string;
  budgetStatus: 'within' | 'over' | 'unknown';
  retryCount: number;
  finalItinerary: IDay[] | null;
  messages: string[];
}

// ─── API Response Types ──────────────────────────────────────
export interface PlanTripRequest {
  origin: string;
  destination: string;
  budget: number;
  currency: string;
  startDate: string;
  endDate: string;
  preferences: string;
}

export interface SSEEvent {
  type: 'status' | 'complete' | 'error' | 'humanReview';
  message: string;
  data?: unknown;
}
