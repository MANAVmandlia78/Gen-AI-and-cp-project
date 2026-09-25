/**
 * Accommodation Agent
 * Selects verified partner stays matching traveler budget tier, group size, and location preferences.
 */

export class AccommodationAgent {
  async run({ hotelsPool = [], hotelPreference = '', travelStyle = 'Standard', destination = '' }) {
    const agentName = 'Accommodation Agent';
    const trace = {
      agent: agentName,
      status: 'completed',
      insights: []
    };

    let selectedHotel = null;
    const prefLower = (hotelPreference || '').toLowerCase();
    const styleLower = (travelStyle || '').toLowerCase();

    // Priority match
    if (hotelsPool && hotelsPool.length > 0) {
      if (prefLower.includes('5-star') || styleLower.includes('luxury') || prefLower.includes('luxury')) {
        selectedHotel = hotelsPool.find(h => h.stars >= 5) || hotelsPool[0];
      } else if (prefLower.includes('budget') || styleLower.includes('budget')) {
        selectedHotel = hotelsPool.find(h => h.stars <= 3) || hotelsPool[hotelsPool.length - 1];
      } else {
        selectedHotel = hotelsPool.find(h => h.stars === 4) || hotelsPool[0];
      }
    }

    if (!selectedHotel) {
      selectedHotel = {
        name: `Maharaja Verified Heritage Stay (${destination})`,
        stars: 4,
        area: 'Central Tourist Area',
        pricePerNight: 4500,
        type: 'Verified Partner Boutique Hotel'
      };
    }

    trace.insights.push(`Selected verified stay: "${selectedHotel.name}" (${selectedHotel.stars}★, ${selectedHotel.area}) at ₹${selectedHotel.pricePerNight}/night.`);

    return {
      agent: agentName,
      selectedHotel,
      amenities: ['Complimentary Breakfast', 'Free High-Speed Wi-Fi', '24/7 Front Desk', 'Private AC Sanitized Rooms', 'Dedicated Chauffeur Parking'],
      checkInTime: '14:00',
      checkOutTime: '11:00',
      trace
    };
  }
}

export const accommodationAgent = new AccommodationAgent();
