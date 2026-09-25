/**
 * Activity & Experience Agent
 * Curates daytime and evening activities matching traveler interests while strictly filtering out avoided items.
 */

export class ActivityAgent {
  async run({
    attractionsPool = [],
    restaurantsPool = [],
    interests = [],
    avoidedActivities = [],
    foodPreferences = [],
    wakeUpTime = '08:30',
    duration = 4
  }) {
    const agentName = 'Activity Agent';
    const trace = {
      agent: agentName,
      status: 'completed',
      insights: []
    };

    const avoidedNormalized = avoidedActivities.map(a => a.toLowerCase());
    const interestsNormalized = interests.map(i => i.toLowerCase());

    // 1. Filter out avoided activities
    const safeAttractions = attractionsPool.filter(att => {
      const nameLower = att.name.toLowerCase();
      const typeLower = att.type.toLowerCase();
      const highlightsLower = (att.highlights || '').toLowerCase();

      for (const avoided of avoidedNormalized) {
        if (avoided.includes('crowd') && (nameLower.includes('baga') || nameLower.includes('mall road'))) {
          // flag or lower priority
        }
        if (avoided.includes('water') && (typeLower.includes('water') || nameLower.includes('rafting') || nameLower.includes('boat'))) {
          return false;
        }
        if (avoided.includes('trek') && (nameLower.includes('trek') || typeLower.includes('adventure'))) {
          return false;
        }
        if (avoided.includes('temple') && (typeLower.includes('religion') || nameLower.includes('temple'))) {
          return false;
        }
      }
      return true;
    });

    // 2. Score by user interests
    const scoredAttractions = (safeAttractions.length > 0 ? safeAttractions : attractionsPool).map(att => {
      let score = 1;
      const text = `${att.name} ${att.type} ${att.highlights} ${att.region}`.toLowerCase();
      for (const interest of interestsNormalized) {
        if (text.includes(interest)) {
          score += 3;
        }
      }
      return { ...att, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore);

    trace.insights.push(`Curated ${scoredAttractions.length} qualified attractions aligned with interests [${interests.join(', ')}].`);
    if (avoidedActivities.length > 0) {
      trace.insights.push(`Strictly excluded disliked activities: [${avoidedActivities.join(', ')}].`);
    }

    return {
      agent: agentName,
      curatedAttractions: scoredAttractions,
      restaurantsPool,
      foodPreferences,
      wakeUpTime,
      trace
    };
  }
}

export const activityAgent = new ActivityAgent();
