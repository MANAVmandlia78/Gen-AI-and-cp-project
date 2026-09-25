/**
 * Destination Research Agent
 * Gathers verified destination profile, seasonal conditions, and key landmark intelligence.
 */

import { destinationTool } from '../tools/destinationTool.js';
import { weatherTool } from '../tools/weatherTool.js';
import { retrievalService } from '../rag/retrieval.js';

export class DestinationResearchAgent {
  async run({ destination, dates, interests = [] }) {
    const agentName = 'Destination Research Agent';
    const trace = {
      agent: agentName,
      status: 'completed',
      insights: []
    };

    // 1. Query RAG context for destination grounding
    const ragContext = await retrievalService.buildContext(`Destination guide attractions travel tips ${destination}`, {
      destination,
      topK: 4
    });

    // 2. Call Destination Tool
    const destData = await destinationTool.execute({
      destination,
      category: 'all',
      filterTags: interests
    });

    // 3. Call Weather Tool
    const weatherData = await weatherTool.execute({
      destination,
      date: dates?.start || null
    });

    trace.insights.push(`Retrieved ${ragContext.sources.length} verified ground truth knowledge sources for ${destData.destination}.`);
    trace.insights.push(`Current/Seasonal Weather: ${weatherData.temperature} with ${weatherData.condition}. Advisory: ${weatherData.advisory}`);

    return {
      agent: agentName,
      destinationName: destData.destination,
      state: destData.state,
      heroImage: destData.image || '/assets/images/kerala.jpg',
      overview: destData.description,
      connectivity: destData.connectivity,
      weather: weatherData,
      attractionsPool: destData.attractions || [],
      hotelsPool: destData.hotels || [],
      restaurantsPool: destData.restaurants || [],
      ragSources: ragContext.sources,
      trace
    };
  }
}

export const destinationAgent = new DestinationResearchAgent();
