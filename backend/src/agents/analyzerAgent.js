import { executeMCPTool } from '../mcp/mcpServer.js';

/**
 * Environmental Problem Analyzer Agent
 * Core Role: Parse and categorize the environmental challenge.
 */
export async function runAnalyzerAgent(userInput) {
  const agentName = "Environmental Problem Analyzer Agent";
  const logs = [];
  
  logs.push(`[${agentName}] Initializing analysis for input: "${userInput.slice(0, 60)}..."`);
  
  // Call MCP safety tool
  logs.push(`[${agentName}] Calling MCP Tool 'verify_input_safety'...`);
  const safetyCheck = await executeMCPTool('verify_input_safety', { userInput });
  
  if (safetyCheck.error || !safetyCheck.result.valid) {
    logs.push(`[${agentName}] Validation failed: ${safetyCheck.error?.message || safetyCheck.result.error}`);
    throw new Error(safetyCheck.error?.message || safetyCheck.result.error || "Input security validation failed.");
  }
  
  const sanitizedInput = safetyCheck.result.sanitizedInput;
  logs.push(`[${agentName}] Input successfully validated and sanitized.`);
  
  // Categorize Sector (Waste, Energy, Water, Transport)
  let sector = "General Sustainability";
  const lowercaseInput = sanitizedInput.toLowerCase();
  
  if (lowercaseInput.includes("waste") || lowercaseInput.includes("compost") || lowercaseInput.includes("garbage") || lowercaseInput.includes("landfill") || lowercaseInput.includes("recycle") || lowercaseInput.includes("packaging")) {
    sector = "Waste Management";
  } else if (lowercaseInput.includes("solar") || lowercaseInput.includes("energy") || lowercaseInput.includes("electricity") || lowercaseInput.includes("hvac") || lowercaseInput.includes("led") || lowercaseInput.includes("power") || lowercaseInput.includes("heating")) {
    sector = "Energy Efficiency";
  } else if (lowercaseInput.includes("water") || lowercaseInput.includes("greywater") || lowercaseInput.includes("rainwater") || lowercaseInput.includes("irrigation") || lowercaseInput.includes("plumbing") || lowercaseInput.includes("sewer") || lowercaseInput.includes("conservation")) {
    sector = "Water Conservation";
  } else if (lowercaseInput.includes("fleet") || lowercaseInput.includes("car") || lowercaseInput.includes("transport") || lowercaseInput.includes("ev") || lowercaseInput.includes("vehicle") || lowercaseInput.includes("commute")) {
    sector = "Sustainable Transportation";
  }
  logs.push(`[${agentName}] Classified problem sector: "${sector}"`);

  // Detect scale
  let scale = "medium";
  if (lowercaseInput.includes("home") || lowercaseInput.includes("apartment") || lowercaseInput.includes("personal") || lowercaseInput.includes("household") || lowercaseInput.includes("small shop")) {
    scale = "small";
  } else if (lowercaseInput.includes("factory") || lowercaseInput.includes("municipal") || lowercaseInput.includes("city") || lowercaseInput.includes("airport") || lowercaseInput.includes("regional") || lowercaseInput.includes("industrial") || lowercaseInput.includes("corporate") || lowercaseInput.includes("enterprise")) {
    scale = "large";
  }
  logs.push(`[${agentName}] Estimated implementation scale: "${scale}"`);

  // Extract key challenges (mock extraction based on keywords)
  const keyChallenges = [];
  if (sector === "Waste Management") {
    keyChallenges.push("High organic matter decomposition causing landfill methane emissions");
    keyChallenges.push("Sub-optimal sorting of packaging materials at source");
  } else if (sector === "Energy Efficiency") {
    keyChallenges.push("Inefficient thermal envelope or HVAC consumption peaks");
    keyChallenges.push("Heavy reliance on fossil-fuel powered grid electricity");
  } else if (sector === "Water Conservation") {
    keyChallenges.push("Inefficient irrigation methods leading to runoff");
    keyChallenges.push("Lack of circular reuse systems for municipal or industrial greywater");
  } else if (sector === "Sustainable Transportation") {
    keyChallenges.push("Direct combustion emissions from standard fleet operation");
    keyChallenges.push("Commute infrastructure lack incentivizing single-occupancy driving");
  } else {
    keyChallenges.push("Inefficient resource utilization and lack of baseline tracking");
  }

  logs.push(`[${agentName}] Identified ${keyChallenges.length} primary challenges.`);
  logs.push(`[${agentName}] Completion of initial analysis phase.`);

  return {
    agentName,
    status: "completed",
    data: {
      sanitizedInput,
      sector,
      scale,
      keyChallenges
    },
    logs
  };
}

export default {
  runAnalyzerAgent
};
