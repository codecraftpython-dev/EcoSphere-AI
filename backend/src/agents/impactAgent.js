import { executeMCPTool } from '../mcp/mcpServer.js';

/**
 * Impact Assessment Agent
 * Core Role: Quantify ecological and economic benefits.
 */
export async function runImpactAgent(analyzerResult) {
  const agentName = "Impact Assessment Agent";
  const logs = [];
  
  const { sector, scale, sanitizedInput } = analyzerResult.data;
  logs.push(`[${agentName}] Commencing quantitative simulation for sector: "${sector}" under "${scale}" scale...`);

  // Call MCP tool
  logs.push(`[${agentName}] Requesting calculation via MCP Tool 'calculate_sustainability_impact'...`);
  const calcResult = await executeMCPTool('calculate_sustainability_impact', { sector, scale });

  if (calcResult.error) {
    logs.push(`[${agentName}] Error from calculator tool: ${calcResult.error.message}`);
    throw new Error(calcResult.error.message);
  }

  const impactData = calcResult.result;
  logs.push(`[${agentName}] Calculations successfully finished.`);
  logs.push(`[${agentName}] Estimated carbon reduction: ${impactData.metrics.carbon_savings_tco2e_per_year} tCO2e/yr`);
  logs.push(`[${agentName}] Projected financial return: $${impactData.metrics.cost_savings_usd_per_year.toLocaleString()}/yr`);
  logs.push(`[${agentName}] Estimated ROI Payback Period: ${impactData.metrics.payback_period_years} years`);

  return {
    agentName,
    status: "completed",
    data: {
      metrics: impactData.metrics,
      calculationsBreakdown: impactData.calculationsBreakdown
    },
    logs
  };
}

export default {
  runImpactAgent
};
