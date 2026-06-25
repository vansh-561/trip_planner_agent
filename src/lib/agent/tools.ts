import { TavilySearch } from '@langchain/tavily';

/**
 * Creates a Tavily search tool for real-time travel research.
 * Falls back gracefully if no API key is set.
 */
export function createSearchTool() {
  if (!process.env.TAVILY_API_KEY) {
    console.warn('[Agent] TAVILY_API_KEY not set — search tool disabled');
    return null;
  }

  return new TavilySearch({
    maxResults: 5,
    tavilyApiKey: process.env.TAVILY_API_KEY,
  });
}
