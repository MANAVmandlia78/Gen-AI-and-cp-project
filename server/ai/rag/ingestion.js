/**
 * Document Ingestion & Chunking Service
 * Chunks documents, packages, and destination entities into vector-indexed knowledge units.
 */

import { DESTINATIONS_KNOWLEDGE, TRAVEL_FAQS_KNOWLEDGE } from './knowledgeBase.js';
import { embeddingService } from './embeddings.js';
import pool from '../../config/db.js';

export class IngestionService {
  constructor() {
    this.chunks = [];
    this.isInitialized = false;
  }

  /**
   * Initialize knowledge base and pre-calculate vectors
   */
  async initialize() {
    if (this.isInitialized) return this.chunks;

    console.log('[RAG Ingestion] Building knowledge base vectors...');
    const rawDocs = [];

    // 1. Ingest Destinations & Attractions
    for (const dest of DESTINATIONS_KNOWLEDGE) {
      rawDocs.push({
        id: `dest_${dest.id}`,
        title: `${dest.name} Destination Guide`,
        category: 'destination',
        destination: dest.name,
        source: 'Maharaja Ground Truth Knowledge Base',
        content: `Destination: ${dest.name}, ${dest.state}. Region: ${dest.region}. Best Season: ${dest.bestSeason}. Overview: ${dest.description} Nearest Airport: ${dest.airport}. Railway: ${dest.railwayStation}. Estimated daily budget: Budget ₹${dest.avgDailyCostPerPerson.budget}, Moderate ₹${dest.avgDailyCostPerPerson.moderate}, Luxury ₹${dest.avgDailyCostPerPerson.luxury}. Tags: ${dest.tags.join(', ')}.`,
        metadata: { tags: dest.tags, bestSeason: dest.bestSeason, airport: dest.airport }
      });

      // Ingest each attraction
      for (const att of dest.attractions) {
        rawDocs.push({
          id: `att_${dest.id}_${att.name.replace(/\s+/g, '_').toLowerCase()}`,
          title: `${att.name} (${dest.name})`,
          category: 'attraction',
          destination: dest.name,
          source: 'Maharaja Verified Attractions',
          content: `Attraction in ${dest.name}: ${att.name}. Type: ${att.type}. Region/Area: ${att.region}. Entry Cost: ₹${att.cost}. Operating Hours: ${att.hours}. Recommended Duration: ${att.duration}. Highlights: ${att.highlights}.`,
          metadata: { ...att, destination: dest.name }
        });
      }

      // Ingest Hotels
      for (const hotel of dest.verifiedHotels) {
        rawDocs.push({
          id: `hotel_${dest.id}_${hotel.name.replace(/\s+/g, '_').toLowerCase()}`,
          title: `${hotel.name} - ${hotel.stars}★ Hotel (${dest.name})`,
          category: 'hotel',
          destination: dest.name,
          source: 'Maharaja Partner Hotels',
          content: `Hotel in ${dest.name}: ${hotel.name}. Star Rating: ${hotel.stars} Stars. Location/Area: ${hotel.area}. Category: ${hotel.type}. Verified Partner Rate: Approx ₹${hotel.pricePerNight}/night. Handpicked for cleanliness and reliability.`,
          metadata: { ...hotel, destination: dest.name }
        });
      }

      // Ingest Restaurants
      for (const rest of dest.verifiedRestaurants) {
        rawDocs.push({
          id: `rest_${dest.id}_${rest.name.replace(/\s+/g, '_').toLowerCase()}`,
          title: `${rest.name} (${dest.name})`,
          category: 'restaurant',
          destination: dest.name,
          source: 'Maharaja Verified Dining',
          content: `Restaurant in ${dest.name}: ${rest.name}. Cuisine: ${rest.cuisine}. Area: ${rest.area}. Avg Cost: ₹${rest.avgCost} per person. Specialties: ${rest.specialty}.`,
          metadata: { ...rest, destination: dest.name }
        });
      }
    }

    // 2. Ingest FAQs
    for (const faq of TRAVEL_FAQS_KNOWLEDGE) {
      rawDocs.push({
        id: `faq_${faq.topic.replace(/\s+/g, '_').toLowerCase()}`,
        title: `Travel FAQ: ${faq.topic}`,
        category: 'faq',
        destination: 'General / India',
        source: 'Maharaja Operational Policies',
        content: `Topic: ${faq.topic}. Question: ${faq.question}. Answer: ${faq.answer}`,
        metadata: { question: faq.question }
      });
    }

    // 3. Dynamically Ingest Active Packages from Database if accessible
    try {
      const [dbPackages] = await pool.query('SELECT * FROM packages WHERE is_active = 1');
      if (Array.isArray(dbPackages) && dbPackages.length > 0) {
        for (const pkg of dbPackages) {
          rawDocs.push({
            id: `pkg_db_${pkg.id}`,
            title: `Package: ${pkg.title}`,
            category: 'package',
            destination: pkg.location || 'India',
            source: 'Maharaja Live Packages Catalog',
            content: `Tour Package: ${pkg.title}. Price Range: ${pkg.price_range}. Duration: ${pkg.nights}. Location: ${pkg.location}. Best Season: ${pkg.season}. Description: ${pkg.description}`,
            metadata: { packageId: pkg.id, price_range: pkg.price_range, nights: pkg.nights }
          });
        }
      }
    } catch (err) {
      console.warn('[RAG Ingestion] Note: Could not query DB for live packages, using verified memory base.');
    }

    // Embed all documents
    for (const doc of rawDocs) {
      const vector = await embeddingService.generateEmbedding(`${doc.title} ${doc.destination} ${doc.category} ${doc.content}`);
      this.chunks.push({
        ...doc,
        vector
      });
    }

    this.isInitialized = true;
    console.log(`[RAG Ingestion] Knowledge base initialized with ${this.chunks.length} indexed chunks.`);
    return this.chunks;
  }

  /**
   * Get all active chunks
   */
  async getChunks() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.chunks;
  }
}

export const ingestionService = new IngestionService();
