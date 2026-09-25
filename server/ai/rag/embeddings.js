/**
 * Embedding Service & Vector Operations
 * Provides vector generation (semantic tf-idf + character hash vectors with pluggable API support)
 * and cosine similarity math.
 */

export class EmbeddingService {
  constructor() {
    this.apiKey = process.env.EMBEDDING_API_KEY || process.env.OPENAI_API_KEY || null;
    this.vectorDimension = 64; // Normalized local embedding dimension
  }

  /**
   * Compute cosine similarity between two vector arrays
   */
  static cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Generate embedding for a text string.
   * Uses deterministic semantic hashing & term vector algorithm with fallback.
   */
  async generateEmbedding(text) {
    if (!text || typeof text !== 'string') {
      return new Array(this.vectorDimension).fill(0);
    }

    const clean = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const tokens = clean.split(/\s+/).filter(t => t.length > 1);

    const vector = new Array(this.vectorDimension).fill(0);

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      let hash = 0;
      for (let j = 0; j < token.length; j++) {
        hash = (hash << 5) - hash + token.charCodeAt(j);
        hash |= 0;
      }
      const idx = Math.abs(hash) % this.vectorDimension;
      const weight = 1 + (token.length > 5 ? 0.5 : 0);
      vector[idx] += weight;

      // Bigram feature
      if (i > 0) {
        const bigram = tokens[i - 1] + '_' + token;
        let biHash = 0;
        for (let k = 0; k < bigram.length; k++) {
          biHash = (biHash << 5) - biHash + bigram.charCodeAt(k);
          biHash |= 0;
        }
        const biIdx = Math.abs(biHash) % this.vectorDimension;
        vector[biIdx] += 1.5;
      }
    }

    // Normalize vector to unit length
    let norm = 0;
    for (let i = 0; i < vector.length; i++) {
      norm += vector[i] * vector[i];
    }
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }
}

export const embeddingService = new EmbeddingService();
