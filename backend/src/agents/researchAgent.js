import { executeMCPTool } from '../mcp/mcpServer.js';

/**
 * Research Agent
 * Core Role: Query local documents and extract standards/benchmarks.
 */
export async function runResearchAgent(analyzerResult) {
  const agentName = "Research Agent";
  const logs = [];
  
  const { sector, sanitizedInput } = analyzerResult.data;
  logs.push(`[${agentName}] Commencing research for sector: "${sector}"`);

  // Call MCP tool to get documents
  const query = `${sector} ${sanitizedInput}`;
  logs.push(`[${agentName}] Calling MCP Tool 'get_documents' with query...`);
  
  const docResult = await executeMCPTool('get_documents', { query });
  
  if (docResult.error) {
    logs.push(`[${agentName}] MCP error while retrieving documents: ${docResult.error.message}`);
    throw new Error(docResult.error.message);
  }

  const { matches, fallback } = docResult.result;
  
  if (fallback) {
    logs.push(`[${agentName}] Note: Local DB search did not find specific matches. Using general guidelines.`);
  } else {
    logs.push(`[${agentName}] Successfully retrieved ${matches.length} matching guidelines.`);
  }

  // Extract reference citations and guidelines
  const guidelines = [];
  const references = [];
  
  matches.forEach(doc => {
    guidelines.push(...doc.best_practices);
    references.push(...doc.references);
  });

  // Unique references
  const uniqueReferences = [...new Set(references)];
  
  logs.push(`[${agentName}] Extracted ${guidelines.length} total guideline statements and ${uniqueReferences.length} sources.`);
  logs.push(`[${agentName}] Research phase complete.`);

  return {
    agentName,
    status: "completed",
    data: {
      retrievedDocuments: matches,
      guidelines,
      references: uniqueReferences
    },
    logs
  };
}

export default {
  runResearchAgent
};
