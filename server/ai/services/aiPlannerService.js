/**
 * AI Planner Service - Central Service Layer
 * Coordinates Planning, Dynamic Re-Planning, Knowledge Retrieval, and User Memory.
 */

import { llmService } from './llmService.js';
import { replanEngine } from '../replanner/replanEngine.js';
import { memoryService } from '../memory/memoryService.js';
import { retrievalService } from '../rag/retrieval.js';
import { ingestionService } from '../rag/ingestion.js';
import { toolRegistry } from '../tools/toolRegistry.js';
import { ItineraryValidator } from '../validators/itineraryValidator.js';

export class AIPlannerService {
  /**
   * Generate new journey itinerary
   */
  async planTrip(planningData) {
    const rawResult = await llmService.generateItinerary(planningData);
    
    // Validate output structure
    const validation = ItineraryValidator.validate(rawResult);
    if (!validation.isValid) {
      console.warn('[AIPlannerService] Schema validation warnings:', validation.errors);
    }

    return {
      success: true,
      itinerary: validation.sanitized
    };
  }

  /**
   * Re-plan an existing itinerary
   */
  async replanTrip(replanData) {
    const replanned = await replanEngine.replan(replanData);
    
    const validation = ItineraryValidator.validate(replanned);
    return {
      success: true,
      itinerary: validation.sanitized,
      replanDiff: replanned.replanDiff
    };
  }

  /**
   * Get user travel preferences
   */
  async getUserPreferences(userId, sessionId) {
    const prefs = await memoryService.getUserPreferences(userId, sessionId);
    return {
      success: true,
      preferences: prefs
    };
  }

  /**
   * Save user travel preferences
   */
  async saveUserPreferences(userId, sessionId, prefs) {
    const saved = await memoryService.saveUserPreferences(userId, sessionId, prefs);
    return {
      success: true,
      preferences: saved
    };
  }

  /**
   * Get saved user itineraries
   */
  async getUserItineraries(userId, sessionId) {
    const trips = await memoryService.getUserItineraries(userId, sessionId);
    return {
      success: true,
      trips
    };
  }

  /**
   * Direct Tool Execution for test / inspection
   */
  async executeTool(toolName, args) {
    return await toolRegistry.executeTool(toolName, args);
  }

  /**
   * Direct RAG Retrieval for test / inspection
   */
  async searchRag(query, options = {}) {
    return await retrievalService.retrieve(query, options);
  }

  /**
   * Get Knowledge Base Statistics
   */
  async getKnowledgeStats() {
    const chunks = await ingestionService.getChunks();
    const categories = {};
    chunks.forEach(c => {
      categories[c.category] = (categories[c.category] || 0) + 1;
    });

    return {
      success: true,
      totalChunks: chunks.length,
      categories,
      availableTools: toolRegistry.getToolSchemas()
    };
  }
}

export const aiPlannerService = new AIPlannerService();
