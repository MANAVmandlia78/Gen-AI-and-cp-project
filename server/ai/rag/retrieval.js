/**
 * Vector Search & Context Retrieval Service (RAG)
 * Retrieves factual knowledge chunks based on semantic similarity and keyword relevance.
 */

import { ingestionService } from './ingestion.js';
import { EmbeddingService, embeddingService } from './embeddings.js';

export class RetrievalService {
  /**
   * Search knowledge base for relevant chunks
   * @param {string} query - User search query or planner prompt
   * @param {Object} options - { topK: 6, destination: string, category: string, threshold: 0.15 }
   */
  async retrieve(query, options = {}) {
    const {
      topK = 6,
      destination = null,
      category = null,
      threshold = 0.1
    } = options;

    const chunks = await ingestionService.getChunks();
    const queryVector = await embeddingService.generateEmbedding(query);
    const queryLower = query.toLowerCase();

    const scored = chunks.map(chunk => {
      // 1. Vector similarity
      const vectorScore = EmbeddingService.cosineSimilarity(queryVector, chunk.vector);

      // 2. Keyword relevance boost
      let keywordBoost = 0;
      const titleLower = chunk.title.toLowerCase();
      const contentLower = chunk.content.toLowerCase();
      const destLower = (chunk.destination || '').toLowerCase();

      if (destination && destLower.includes(destination.toLowerCase())) {
        keywordBoost += 0.35;
      }
      if (category && chunk.category === category) {
        keywordBoost += 0.25;
      }

      // Check query keywords
      const words = queryLower.split(/\s+/).filter(w => w.length > 2);
      let matchCount = 0;
      for (const w of words) {
        if (titleLower.includes(w)) matchCount += 2;
        if (contentLower.includes(w)) matchCount += 1;
      }
      if (words.length > 0) {
        keywordBoost += (matchCount / (words.length * 2)) * 0.4;
      }

      const totalScore = (vectorScore * 0.5) + keywordBoost;

      return {
        ...chunk,
        score: parseFloat(totalScore.toFixed(4)),
        vectorScore: parseFloat(vectorScore.toFixed(4))
      };
    });

    // Filter and sort
    let results = scored
      .filter(item => item.score >= threshold)
      .sort((a, b) => b.score - a.score);

    // If destination is specified, strongly prioritize destination-matching chunks
    if (destination) {
      const destMatches = results.filter(r => (r.destination || '').toLowerCase().includes(destination.toLowerCase()));
      if (destMatches.length > 0) {
        const others = results.filter(r => !(r.destination || '').toLowerCase().includes(destination.toLowerCase()));
        results = [...destMatches, ...others];
      }
    }

    const topResults = results.slice(0, topK);

    return {
      query,
      totalIndexed: chunks.length,
      retrievedCount: topResults.length,
      items: topResults.map(r => ({
        id: r.id,
        title: r.title,
        category: r.category,
        destination: r.destination,
        source: r.source,
        score: r.score,
        content: r.content,
        metadata: r.metadata
      }))
    };
  }

  /**
   * Build formatted markdown/text context for prompt injection
   */
  async buildContext(query, options = {}) {
    const searchResult = await this.retrieve(query, options);
    
    if (!searchResult.items || searchResult.items.length === 0) {
      return {
        contextText: 'No specific knowledge base records found. Use standard verified travel safety and reasonable estimates.',
        sources: []
      };
    }

    let contextText = '--- VERIFIED TRAVEL GROUND TRUTH (RAG CONTEXT) ---\n';
    const sources = [];

    searchResult.items.forEach((item, idx) => {
      contextText += `[Doc ${idx + 1}] [Category: ${item.category}] [Source: ${item.source}] ${item.title}\n`;
      contextText += `${item.content}\n\n`;
      sources.push({
        id: item.id,
        title: item.title,
        category: item.category,
        source: item.source,
        destination: item.destination
      });
    });

    contextText += '--- END OF GROUND TRUTH ---\n';

    return {
      contextText,
      sources,
      items: searchResult.items
    };
  }
}

export const retrievalService = new RetrievalService();
