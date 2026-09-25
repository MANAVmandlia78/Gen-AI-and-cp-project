/**
 * Memory & Personalization Service
 * Manages Short-term Session Memory and Persistent Long-term Travel Preferences.
 */

import pool from '../../config/db.js';

// Fallback in-memory store for development or non-DB sessions
const inMemoryPreferences = new Map();
const inMemoryItineraries = new Map();
const shortTermSessions = new Map();

export class MemoryService {
  /**
   * --- SHORT TERM MEMORY ---
   * Stores active conversation history, recent queries, and temporary overrides
   */
  getShortTermSession(sessionId) {
    if (!sessionId) return { history: [], context: {} };
    if (!shortTermSessions.has(sessionId)) {
      shortTermSessions.set(sessionId, {
        sessionId,
        history: [],
        context: {},
        lastActive: Date.now()
      });
    }
    return shortTermSessions.get(sessionId);
  }

  updateShortTermSession(sessionId, updateData) {
    if (!sessionId) return;
    const session = this.getShortTermSession(sessionId);
    if (updateData.message) {
      session.history.push({
        role: updateData.role || 'user',
        text: updateData.message,
        timestamp: new Date().toISOString()
      });
      // Keep only last 10 messages in short-term buffer
      if (session.history.length > 10) {
        session.history.shift();
      }
    }
    if (updateData.context) {
      session.context = { ...session.context, ...updateData.context };
    }
    session.lastActive = Date.now();
    shortTermSessions.set(sessionId, session);
  }

  /**
   * --- LONG TERM MEMORY ---
   * Stores profile preferences: dietary needs, avoided activities, preferred wake up time, budget tier
   */
  async getUserPreferences(userId, sessionId) {
    // 1. Try MySQL Database
    if (userId) {
      try {
        const [rows] = await pool.query(
          'SELECT * FROM user_ai_preferences WHERE user_id = ? ORDER BY updated_at DESC LIMIT 1',
          [userId]
        );
        if (rows && rows.length > 0) {
          const pref = rows[0];
          return {
            source: 'database',
            userId,
            budgetTier: pref.budget_tier || 'moderate',
            favoriteDestinations: typeof pref.favorite_destinations === 'string' ? JSON.parse(pref.favorite_destinations || '[]') : (pref.favorite_destinations || []),
            foodPreferences: typeof pref.food_preferences === 'string' ? JSON.parse(pref.food_preferences || '[]') : (pref.food_preferences || ['Vegetarian Friendly']),
            hotelPreference: pref.hotel_preference || '3-star boutique or verified partner',
            preferredStyle: pref.preferred_style || 'Balanced & Cultural',
            preferredActivities: typeof pref.preferred_activities === 'string' ? JSON.parse(pref.preferred_activities || '[]') : (pref.preferred_activities || ['Sightseeing', 'Local Food']),
            avoidedActivities: typeof pref.avoided_activities === 'string' ? JSON.parse(pref.avoided_activities || '[]') : (pref.avoided_activities || ['Early morning starts before 9 AM']),
            preferredPace: pref.preferred_pace || 'moderate',
            wakeUpTime: pref.wake_up_time || '08:30',
            customNotes: pref.custom_notes || ''
          };
        }
      } catch (err) {
        console.warn('[MemoryService] DB query failed, falling back to memory store:', err.message);
      }
    }

    // 2. Check Session / In-Memory Store
    const key = userId ? `user_${userId}` : `session_${sessionId || 'default'}`;
    if (inMemoryPreferences.has(key)) {
      return {
        source: 'in_memory',
        ...inMemoryPreferences.get(key)
      };
    }

    // Default sensible preferences
    return {
      source: 'default',
      userId: userId || null,
      sessionId: sessionId || null,
      budgetTier: 'moderate',
      favoriteDestinations: ['Goa', 'Kerala', 'Rajasthan'],
      foodPreferences: ['Vegetarian Friendly', 'Authentic Local Flavors'],
      hotelPreference: '3-star boutique or verified partner resort',
      preferredStyle: 'Balanced',
      preferredActivities: ['Sightseeing', 'Scenic viewpoints', 'Local culinary experiences'],
      avoidedActivities: ['Activities before 9:00 AM', 'Overcrowded tourist traps'],
      preferredPace: 'relaxed',
      wakeUpTime: '08:30',
      customNotes: 'Prefers relaxed mornings and comfortable transit with scenic photo stops.'
    };
  }

  /**
   * Save or update long-term user preferences
   */
  async saveUserPreferences(userId, sessionId, prefs) {
    const key = userId ? `user_${userId}` : `session_${sessionId || 'default'}`;
    
    const formattedPrefs = {
      budgetTier: prefs.budgetTier || 'moderate',
      favoriteDestinations: prefs.favoriteDestinations || [],
      foodPreferences: prefs.foodPreferences || [],
      hotelPreference: prefs.hotelPreference || '3-star boutique or verified partner resort',
      preferredStyle: prefs.preferredStyle || 'Balanced',
      preferredActivities: prefs.preferredActivities || [],
      avoidedActivities: prefs.avoidedActivities || [],
      preferredPace: prefs.preferredPace || 'moderate',
      wakeUpTime: prefs.wakeUpTime || '08:30',
      customNotes: prefs.customNotes || ''
    };

    inMemoryPreferences.set(key, formattedPrefs);

    if (userId) {
      try {
        const [existing] = await pool.query('SELECT id FROM user_ai_preferences WHERE user_id = ?', [userId]);
        if (existing && existing.length > 0) {
          await pool.query(
            `UPDATE user_ai_preferences SET 
              budget_tier = ?, favorite_destinations = ?, food_preferences = ?, 
              hotel_preference = ?, preferred_style = ?, preferred_activities = ?, 
              avoided_activities = ?, preferred_pace = ?, wake_up_time = ?, custom_notes = ?
             WHERE user_id = ?`,
            [
              formattedPrefs.budgetTier,
              JSON.stringify(formattedPrefs.favoriteDestinations),
              JSON.stringify(formattedPrefs.foodPreferences),
              formattedPrefs.hotelPreference,
              formattedPrefs.preferredStyle,
              JSON.stringify(formattedPrefs.preferredActivities),
              JSON.stringify(formattedPrefs.avoidedActivities),
              formattedPrefs.preferredPace,
              formattedPrefs.wakeUpTime,
              formattedPrefs.customNotes,
              userId
            ]
          );
        } else {
          await pool.query(
            `INSERT INTO user_ai_preferences 
              (user_id, session_id, budget_tier, favorite_destinations, food_preferences, hotel_preference, preferred_style, preferred_activities, avoided_activities, preferred_pace, wake_up_time, custom_notes)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              userId,
              sessionId || null,
              formattedPrefs.budgetTier,
              JSON.stringify(formattedPrefs.favoriteDestinations),
              JSON.stringify(formattedPrefs.foodPreferences),
              formattedPrefs.hotelPreference,
              formattedPrefs.preferredStyle,
              JSON.stringify(formattedPrefs.preferredActivities),
              JSON.stringify(formattedPrefs.avoidedActivities),
              formattedPrefs.preferredPace,
              formattedPrefs.wakeUpTime,
              formattedPrefs.customNotes
            ]
          );
        }
      } catch (err) {
        console.warn('[MemoryService] DB preference save note:', err.message);
      }
    }

    return formattedPrefs;
  }

  /**
   * Save generated itinerary to history
   */
  async saveItinerary(userId, sessionId, itineraryData) {
    const key = userId ? `user_${userId}` : `session_${sessionId || 'default'}`;
    const list = inMemoryItineraries.get(key) || [];
    
    const itineraryRecord = {
      id: itineraryData.id || `itin_${Date.now()}`,
      destination: itineraryData.destination,
      title: itineraryData.title || `${itineraryData.duration}-Day ${itineraryData.destination} AI Journey`,
      duration: itineraryData.duration,
      travelers: itineraryData.travelers || 2,
      estimatedBudget: itineraryData.estimatedBudget,
      currency: itineraryData.currency || 'INR',
      itineraryJson: itineraryData,
      planVersion: itineraryData.planVersion || 1,
      replannedFromId: itineraryData.replannedFromId || null,
      replanReason: itineraryData.replanReason || null,
      createdAt: new Date().toISOString()
    };

    list.unshift(itineraryRecord);
    inMemoryItineraries.set(key, list.slice(0, 20)); // keep 20 recent in cache

    if (userId) {
      try {
        await pool.query(
          `INSERT INTO user_ai_itineraries 
            (user_id, session_id, destination, title, duration, travelers, estimated_budget, currency, itinerary_json, plan_version, replan_reason)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            sessionId || null,
            itineraryRecord.destination,
            itineraryRecord.title,
            itineraryRecord.duration,
            itineraryRecord.travelers,
            itineraryRecord.estimatedBudget,
            itineraryRecord.currency,
            JSON.stringify(itineraryRecord.itineraryJson),
            itineraryRecord.planVersion,
            itineraryRecord.replanReason
          ]
        );
      } catch (err) {
        console.warn('[MemoryService] DB itinerary save note:', err.message);
      }
    }

    return itineraryRecord;
  }

  /**
   * Get user previous saved itineraries
   */
  async getUserItineraries(userId, sessionId) {
    if (userId) {
      try {
        const [rows] = await pool.query(
          'SELECT * FROM user_ai_itineraries WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
          [userId]
        );
        if (rows && rows.length > 0) {
          return rows.map(r => ({
            id: r.id,
            destination: r.destination,
            title: r.title,
            duration: r.duration,
            travelers: r.travelers,
            estimatedBudget: r.estimated_budget,
            currency: r.currency,
            itineraryJson: typeof r.itinerary_json === 'string' ? JSON.parse(r.itinerary_json) : r.itinerary_json,
            planVersion: r.plan_version,
            replanReason: r.replan_reason,
            createdAt: r.created_at
          }));
        }
      } catch (err) {
        console.warn('[MemoryService] DB fetch itineraries note:', err.message);
      }
    }

    const key = userId ? `user_${userId}` : `session_${sessionId || 'default'}`;
    return inMemoryItineraries.get(key) || [];
  }
}

export const memoryService = new MemoryService();
