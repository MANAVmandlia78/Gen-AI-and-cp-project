/**
 * LLM Integration & Production Fallback Service
 * Connects to external LLM APIs (Gemini / OpenAI) if keys are provided,
 * otherwise leverages the ground-truth Multi-Agent synthesis pipeline.
 */

import { orchestratorAgent } from '../agents/orchestratorAgent.js';
import { retrievalService } from '../rag/retrieval.js';
import { toolRegistry } from '../tools/toolRegistry.js';

export class LLMService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY || null;
    this.openaiApiKey = process.env.OPENAI_API_KEY || null;
  }

  /**
   * Generates itinerary using LLM or Multi-Agent Engine
   */
  async generateItinerary(planningRequest) {
    // 1. If Gemini / OpenAI API key is present in backend environment, call it with RAG context
    if (this.geminiApiKey && typeof fetch === 'function') {
      try {
        console.log('[LLMService] Attempting LLM generation via Gemini API...');
        const ragContext = await retrievalService.buildContext(
          `${planningRequest.destination} ${planningRequest.interests?.join(' ')} ${planningRequest.foodPreferences?.join(' ')}`,
          { destination: planningRequest.destination, topK: 5 }
        );

        const systemPrompt = `You are the Lead AI Travel Architect for Maharaja Tours & Travels.
Generate a structured JSON travel itinerary strictly grounded on the provided verified knowledge base.
Do not hallucinate fake prices or impossible transit times.
Knowledge base context:
${ragContext.contextText}

Travel Request:
Destination: ${planningRequest.destination}
Duration: ${planningRequest.duration} days
Travelers: ${planningRequest.travelers}
Budget: ${planningRequest.targetBudget || 'Standard'}
Interests: ${(planningRequest.interests || []).join(', ')}
Food: ${(planningRequest.foodPreferences || []).join(', ')}
Avoided: ${(planningRequest.avoidedActivities || []).join(', ')}

Return ONLY valid JSON matching this schema:
{
  "destination": "${planningRequest.destination}",
  "duration": ${planningRequest.duration},
  "estimatedBudget": 30000,
  "currency": "INR",
  "costPerPerson": 10000,
  "travelStyle": "${planningRequest.travelStyle || 'Balanced'}",
  "days": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "activities": [
        {
          "name": "Activity Name",
          "startTime": "09:30",
          "duration": "2 hours",
          "estimatedCost": 0,
          "type": "sightseeing",
          "location": "Area",
          "notes": "Verified description",
          "verified": true
        }
      ]
    }
  ],
  "recommendations": ["Recommendation 1"],
  "warnings": [],
  "sources": []
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        });

        if (resp.ok) {
          const data = await resp.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            return {
              ...parsed,
              sources: ragContext.sources,
              metadata: {
                engine: 'Gemini 1.5 Flash + Grounded RAG',
                generatedAt: new Date().toISOString()
              }
            };
          }
        }
      } catch (llmErr) {
        console.warn('[LLMService] Gemini API call warning, falling back to Multi-Agent Orchestrator:', llmErr.message);
      }
    }

    // 2. Production Multi-Agent Engine (Deterministic, grounded, robust)
    console.log('[LLMService] Executing Multi-Agent Orchestrator System...');
    return await orchestratorAgent.planJourney(planningRequest);
  }
}

export const llmService = new LLMService();
