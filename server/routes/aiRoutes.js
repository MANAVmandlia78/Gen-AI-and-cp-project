/**
 * AI Travel Intelligence Express Routes
 * Mounts endpoints for RAG, Multi-Agent Planning, Tool Calling, Memory, and Dynamic Re-Planning.
 */

import express from 'express';
import { aiPlannerService } from '../ai/services/aiPlannerService.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/ai/plan
 * Generates grounded travel itinerary
 */
router.post('/plan', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId || null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || 'guest_session';
    
    const planningData = {
      ...req.body,
      userId,
      sessionId
    };

    const result = await aiPlannerService.planTrip(planningData);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/replan
 * Dynamic itinerary re-planning with Before/After change diff
 */
router.post('/replan', optionalAuth, async (req, res, next) => {
  try {
    const result = await aiPlannerService.replanTrip(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/preferences
 * Fetch user travel preferences & long-term memory
 */
router.get('/preferences', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.userId || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || 'guest_session';
    const result = await aiPlannerService.getUserPreferences(userId, sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/preferences
 * Save or update user travel preferences
 */
router.post('/preferences', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId || null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId || 'guest_session';
    const result = await aiPlannerService.saveUserPreferences(userId, sessionId, req.body.preferences || req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/trips
 * Fetch saved itineraries for user or session
 */
router.get('/trips', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || req.query.userId || null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId || 'guest_session';
    const result = await aiPlannerService.getUserItineraries(userId, sessionId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/ai/tools/execute
 * Direct tool execution endpoint for inspection and telemetry
 */
router.post('/tools/execute', async (req, res, next) => {
  try {
    const { tool, args } = req.body;
    if (!tool) {
      return res.status(400).json({ success: false, message: 'Tool name is required.' });
    }
    const result = await aiPlannerService.executeTool(tool, args || {});
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/rag/search
 * Inspect vector search and context retrieval directly
 */
router.get('/rag/search', async (req, res, next) => {
  try {
    const query = req.query.q || req.query.query || 'Goa beach holiday';
    const destination = req.query.destination || null;
    const category = req.query.category || null;
    const topK = parseInt(req.query.topK || '5', 10);

    const result = await aiPlannerService.searchRag(query, { destination, category, topK });
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ai/stats
 * Get knowledge base size, chunks breakdown, and available tool declarations
 */
router.get('/stats', async (req, res, next) => {
  try {
    const result = await aiPlannerService.getKnowledgeStats();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
