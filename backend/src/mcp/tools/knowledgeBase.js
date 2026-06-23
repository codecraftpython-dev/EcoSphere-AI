import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Relative path to the local database file
const DB_PATH = path.resolve(__dirname, '../../../data/documents/sustainability_db.json');

/**
 * Reads local database and searches for relevant documents based on user query
 * @param {string} query 
 * @returns {Promise<Object>} Search results containing matching docs and references
 */
export async function searchKnowledgeBase(query) {
  try {
    const rawData = await fs.promises.readFile(DB_PATH, 'utf8');
    const db = JSON.parse(rawData);
    
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        message: "Search query must be a valid string.",
        matches: []
      };
    }

    const stopwords = new Set(["with", "this", "that", "your", "our", "their", "from", "for", "and", "the", "are", "have", "has", "will", "would", "can", "should", "about", "what", "where", "when", "want"]);
    const queryTokens = query.toLowerCase()
      .split(/[\s,.:;?!\(\)"']+/).filter(t => t.length > 2 && !stopwords.has(t));
    
    // Score each document based on token matches in keywords, title, summary, and sector
    const scoredDocs = db.map(doc => {
      let score = 0;
      
      queryTokens.forEach(token => {
        // High weight matches
        if (doc.sector.toLowerCase().includes(token)) score += 3;
        if (doc.title.toLowerCase().includes(token)) score += 2;
        
        // Keyword matches
        doc.keywords.forEach(kw => {
          if (kw.toLowerCase().includes(token)) score += 1.5;
        });

        // Summary matches
        if (doc.summary.toLowerCase().includes(token)) score += 1;
      });

      return { ...doc, score };
    });

    // Sort descending by score
    const matches = scoredDocs
      .filter(doc => doc.score > 0)
      .sort((a, b) => b.score - a.score);

    // If no matches, return all documents but flagged with 0 score (or default fallback)
    if (matches.length === 0) {
      return {
        success: true,
        message: "No specific matches found. Returning general sustainability guidelines.",
        matches: db.slice(0, 2), // Default fallback
        fallback: true
      };
    }

    return {
      success: true,
      message: `Found ${matches.length} matching documents in local knowledge base.`,
      matches: matches.map(m => {
        // Remove the score attribute to keep it clean
        const { score, ...cleanDoc } = m;
        return cleanDoc;
      }),
      fallback: false
    };
  } catch (error) {
    return {
      success: false,
      message: `Error reading knowledge base: ${error.message}`,
      matches: []
    };
  }
}

export default {
  searchKnowledgeBase
};
