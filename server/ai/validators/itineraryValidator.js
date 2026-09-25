/**
 * Itinerary Safety & Schema Validator
 * Enforces production-grade reliability rules before returning JSON to frontend.
 */

export class ItineraryValidator {
  /**
   * Validate full itinerary object
   */
  static validate(itinerary) {
    const errors = [];
    const sanitized = { ...itinerary };

    if (!sanitized.destination || typeof sanitized.destination !== 'string') {
      errors.push('Destination is missing or invalid.');
    }

    if (!sanitized.duration || isNaN(sanitized.duration) || sanitized.duration < 1) {
      errors.push('Duration must be a positive integer.');
    } else {
      sanitized.duration = parseInt(sanitized.duration, 10);
    }

    if (!sanitized.estimatedBudget || isNaN(sanitized.estimatedBudget) || sanitized.estimatedBudget <= 0) {
      errors.push('Estimated budget must be a positive number.');
    } else {
      sanitized.estimatedBudget = Math.round(Number(sanitized.estimatedBudget));
    }

    if (!sanitized.currency) {
      sanitized.currency = 'INR';
    }

    if (!Array.isArray(sanitized.days) || sanitized.days.length === 0) {
      errors.push('Itinerary must contain at least one planned day.');
    } else {
      sanitized.days.forEach((dayObj, dIdx) => {
        if (!dayObj.day || isNaN(dayObj.day)) {
          dayObj.day = dIdx + 1;
        }
        if (!Array.isArray(dayObj.activities) || dayObj.activities.length === 0) {
          errors.push(`Day ${dayObj.day} contains no scheduled activities.`);
        } else {
          dayObj.activities.forEach((act, aIdx) => {
            if (!act.name || typeof act.name !== 'string') {
              act.name = `Scheduled Sightseeing Activity ${aIdx + 1}`;
            }
            if (!act.startTime || typeof act.startTime !== 'string') {
              act.startTime = '10:00';
            }
            if (act.estimatedCost === undefined || isNaN(act.estimatedCost)) {
              act.estimatedCost = 0;
            } else {
              act.estimatedCost = Math.round(Number(act.estimatedCost));
            }
          });
        }
      });
    }

    if (!Array.isArray(sanitized.recommendations)) {
      sanitized.recommendations = [];
    }
    if (!Array.isArray(sanitized.warnings)) {
      sanitized.warnings = [];
    }
    if (!Array.isArray(sanitized.sources)) {
      sanitized.sources = [];
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }
}
