import { validateInput } from './tools/validator.js';
import { searchKnowledgeBase } from './tools/knowledgeBase.js';
import { calculateImpact } from './tools/calculator.js';

/**
 * Registry of available MCP Tools
 */
const TOOLS = {
  'verify_input_safety': {
    description: 'Validates and sanitizes the user environmental challenge input for security and length constraints.',
    parameters: {
      userInput: { type: 'string', required: true }
    },
    execute: async (params) => {
      if (!params || typeof params.userInput !== 'string') {
        throw new Error("Invalid parameters. 'userInput' string is required.");
      }
      return validateInput(params.userInput);
    }
  },
  'get_documents': {
    description: 'Retrieves relevant environmental regulations and best practices from local knowledge base documents.',
    parameters: {
      query: { type: 'string', required: true }
    },
    execute: async (params) => {
      if (!params || typeof params.query !== 'string') {
        throw new Error("Invalid parameters. 'query' string is required.");
      }
      return await searchKnowledgeBase(params.query);
    }
  },
  'calculate_sustainability_impact': {
    description: 'Computes estimated environmental savings and return-on-investment based on sector and scale.',
    parameters: {
      sector: { type: 'string', required: true },
      scale: { type: 'string', required: false }
    },
    execute: async (params) => {
      if (!params || typeof params.sector !== 'string') {
        throw new Error("Invalid parameters. 'sector' string is required.");
      }
      const scale = params.scale || 'medium';
      return calculateImpact(params.sector, scale);
    }
  }
};

/**
 * Simulated MCP server executor
 * Mimics JSON-RPC 2.0 tool execution
 * @param {string} toolName 
 * @param {Object} params 
 * @returns {Promise<Object>} JSON-RPC 2.0 response format
 */
export async function executeMCPTool(toolName, params) {
  const tool = TOOLS[toolName];
  if (!tool) {
    return {
      jsonrpc: "2.0",
      error: {
        code: -32601,
        message: `Method not found: Tool '${toolName}' is not registered on this MCP server.`
      },
      id: null
    };
  }

  try {
    // Basic validation of required parameters
    for (const [key, spec] of Object.entries(tool.parameters)) {
      if (spec.required && (params === undefined || params[key] === undefined)) {
        return {
          jsonrpc: "2.0",
          error: {
            code: -32602,
            message: `Invalid params: Missing required parameter '${key}'.`
          },
          id: null
        };
      }
    }

    const result = await tool.execute(params);
    return {
      jsonrpc: "2.0",
      result,
      id: Date.now()
    };
  } catch (error) {
    return {
      jsonrpc: "2.0",
      error: {
        code: -32603,
        message: `Internal error executing tool '${toolName}': ${error.message}`
      },
      id: null
    };
  }
}

/**
 * Returns schemas and descriptions of all registered tools
 */
export function listMCPTools() {
  return Object.keys(TOOLS).map(name => ({
    name,
    description: TOOLS[name].description,
    parameters: TOOLS[name].parameters
  }));
}

export default {
  executeMCPTool,
  listMCPTools
};
