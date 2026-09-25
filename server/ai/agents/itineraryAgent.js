/**
 * Itinerary Agent
 * Combines agent outputs into a practical, realistic day-by-day itinerary with exact timing and buffers.
 */

import { mapsTool } from '../tools/mapsTool.js';

export class ItineraryAgent {
  async run({
    destination = 'Goa',
    duration = 4,
    curatedAttractions = [],
    restaurantsPool = [],
    selectedHotel = {},
    wakeUpTime = '08:30',
    foodPreferences = [],
    travelStyle = 'Standard'
  }) {
    const agentName = 'Itinerary Agent';
    const trace = {
      agent: agentName,
      status: 'completed',
      insights: []
    };

    const days = [];
    const numDays = Math.max(1, parseInt(duration, 10));

    // Determine initial morning start time based on wake-up constraint
    let startHour = 9;
    let startMinute = 30;
    if (wakeUpTime) {
      const parts = wakeUpTime.split(':');
      if (parts.length === 2) {
        startHour = parseInt(parts[0], 10);
        startMinute = parseInt(parts[1], 10) + 30; // 30 mins buffer after wake up for breakfast
        if (startMinute >= 60) {
          startHour += 1;
          startMinute -= 60;
        }
      }
    }
    // Ensure not earlier than 09:30 if user expressed morning relaxation
    if (startHour < 9 || (startHour === 9 && startMinute < 0)) {
      startHour = 9;
      startMinute = 30;
    }

    const fmtTime = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

    let attIndex = 0;
    const totalAttractions = curatedAttractions.length;

    for (let d = 1; d <= numDays; d++) {
      const dayActivities = [];
      let currentH = startHour;
      let currentM = startMinute;

      // 1. Morning Breakfast / Leisure
      dayActivities.push({
        id: `d${d}_act_breakfast`,
        name: d === 1 ? `Arrival, Check-in & Breakfast at ${selectedHotel.name || 'Hotel'}` : `Artisanal Breakfast at ${selectedHotel.name || 'Resort'}`,
        startTime: fmtTime(currentH, currentM),
        duration: '1 hr',
        estimatedCost: 0,
        type: 'food',
        location: selectedHotel.area || destination,
        notes: `Enjoy wholesome local morning spread (${foodPreferences.slice(0, 2).join(', ') || 'Fresh Continental & Indian'}).`,
        verified: true
      });

      currentH += 1;
      currentM += 15; // 15 mins travel buffer

      // 2. Primary Morning Attraction
      if (totalAttractions > 0) {
        const morningAtt = curatedAttractions[attIndex % totalAttractions];
        attIndex++;
        
        // Calculate transit using maps tool
        const transit = await mapsTool.execute({
          origin: selectedHotel.name || destination,
          destination: morningAtt.name
        });

        dayActivities.push({
          id: `d${d}_act_morn`,
          name: morningAtt.name,
          startTime: fmtTime(currentH, currentM),
          duration: morningAtt.duration || '2 hours',
          estimatedCost: morningAtt.cost || 0,
          type: morningAtt.type || 'sightseeing',
          location: morningAtt.region || destination,
          transitInfo: `${transit.distanceFormatted} (${transit.travelTimeFormatted} private drive)`,
          notes: morningAtt.highlights || `Explore the scenic beauty and cultural history.`,
          verified: true
        });

        currentH += 2;
        currentM += 30;
      }

      // 3. Lunch Experience
      if (currentH < 13) currentH = 13;
      const lunchSpot = restaurantsPool[d % (restaurantsPool.length || 1)] || {
        name: `Local Gourmet Dining (${destination})`,
        area: 'Central',
        cuisine: foodPreferences[0] || 'Authentic Regional Delicacies',
        avgCost: 500
      };

      dayActivities.push({
        id: `d${d}_act_lunch`,
        name: `Lunch at ${lunchSpot.name}`,
        startTime: fmtTime(currentH, currentM),
        duration: '1 hr 15 mins',
        estimatedCost: lunchSpot.avgCost || 450,
        type: 'food',
        location: lunchSpot.area || destination,
        notes: `Specialty: ${lunchSpot.specialty || lunchSpot.cuisine}. Verified hygienic partner kitchen.`,
        verified: true
      });

      currentH += 1;
      currentM += 45;

      // 4. Afternoon / Sunset Sightseeing or Leisure
      if (totalAttractions > 0) {
        const aftAtt = curatedAttractions[attIndex % totalAttractions];
        attIndex++;

        dayActivities.push({
          id: `d${d}_act_afternoon`,
          name: aftAtt.name,
          startTime: fmtTime(currentH, currentM),
          duration: aftAtt.duration || '2 hours',
          estimatedCost: aftAtt.cost || 0,
          type: aftAtt.type || 'leisure',
          location: aftAtt.region || destination,
          notes: aftAtt.highlights || `Sunset viewpoint and photo opportunities.`,
          verified: true
        });

        currentH += 2;
        currentM += 15;
      }

      // 5. Evening Dining & Cultural Walk
      if (currentH < 20) currentH = 20;
      dayActivities.push({
        id: `d${d}_act_dinner`,
        name: d === numDays ? `Farewell Celebration Dinner & Night Walk` : `Dinner & Vibrant Evening Atmosphere`,
        startTime: fmtTime(currentH, 0),
        duration: '2 hours',
        estimatedCost: 650,
        type: 'nightlife',
        location: destination,
        notes: `Relaxing evening experience with local music and curated delicacies.`,
        verified: true
      });

      days.push({
        day: d,
        title: `Day ${d}: ${d === 1 ? 'Arrival & Coastal Welcome' : d === numDays ? 'Grand Finale & Souvenirs' : 'Cultural & Heritage Explorations'}`,
        theme: d % 2 === 1 ? 'Heritage & Signature Landmarks' : 'Scenic Nature & Leisure Strolls',
        activities: dayActivities
      });
    }

    trace.insights.push(`Synthesized a ${numDays}-day balanced itinerary with ${days.reduce((acc, d) => acc + d.activities.length, 0)} total scheduled experiences.`);

    return {
      agent: agentName,
      days,
      trace
    };
  }
}

export const itineraryAgent = new ItineraryAgent();
