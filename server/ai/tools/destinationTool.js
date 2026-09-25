/**
 * Destination & Inventory Search Tool
 * Factual lookup for verified destinations, attractions, hotels, and dining.
 */

import { DESTINATIONS_KNOWLEDGE } from '../rag/knowledgeBase.js';

export const destinationTool = {
  name: 'searchDestinationAndInventory',
  description: 'Searches verified ground-truth attractions, partner hotels, restaurants, and connectivity for a destination.',
  parameters: {
    type: 'object',
    properties: {
      destination: { type: 'string', description: 'Destination name (e.g. Goa, Kerala, Manali)' },
      category: { type: 'string', enum: ['all', 'attractions', 'hotels', 'restaurants'], description: 'Category to search' },
      filterTags: { type: 'array', items: { type: 'string' }, description: 'Tags like beaches, vegetarian, nature, heritage' }
    },
    required: ['destination']
  },

  async execute({ destination, category = 'all', filterTags = [] }) {
    const destNorm = (destination || '').toLowerCase();
    
    // Find closest destination record
    const match = DESTINATIONS_KNOWLEDGE.find(d => 
      d.name.toLowerCase().includes(destNorm) ||
      destNorm.includes(d.name.toLowerCase().split(' ')[0]) ||
      d.state.toLowerCase().includes(destNorm)
    ) || DESTINATIONS_KNOWLEDGE[0]; // fallback to first destination if generic

    const result = {
      destination: match.name,
      state: match.state,
      image: match.image || '/assets/images/kerala.jpg',
      bestSeason: match.bestSeason,
      description: match.description,
      connectivity: {
        airport: match.airport,
        railway: match.railwayStation
      }
    };

    if (category === 'all' || category === 'attractions') {
      let atts = match.attractions;
      if (filterTags && filterTags.length > 0) {
        const tagsLower = filterTags.map(t => t.toLowerCase());
        const filtered = atts.filter(a => tagsLower.some(tag => 
          a.type.toLowerCase().includes(tag) || 
          a.name.toLowerCase().includes(tag) || 
          a.highlights.toLowerCase().includes(tag)
        ));
        if (filtered.length > 0) atts = filtered;
      }
      result.attractions = atts;
    }

    if (category === 'all' || category === 'hotels') {
      result.hotels = match.verifiedHotels;
    }

    if (category === 'all' || category === 'restaurants') {
      result.restaurants = match.verifiedRestaurants;
    }

    return result;
  }
};
