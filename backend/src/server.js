import express from 'express';
import cors from 'cors';
import { runAnalyzerAgent } from './agents/analyzerAgent.js';
import { runResearchAgent } from './agents/researchAgent.js';
import { runPlannerAgent } from './agents/plannerAgent.js';
import { runImpactAgent } from './agents/impactAgent.js';
import { runAdvisorAgent } from './agents/advisorAgent.js';
import { listMCPTools } from './mcp/mcpServer.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Endpoint: List MCP Tools
app.get('/api/tools', (req, res) => {
  try {
    const tools = listMCPTools();
    res.json({ success: true, tools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Run Multi-Agent Sustainability Advisor Pipeline
app.post('/api/analyze', async (req, res) => {
  const { problem } = req.body;
  
  if (!problem || typeof problem !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: "Problem description is required and must be a string." 
    });
  }

  console.log(`[Server] Initiating multi-agent collaboration for: "${problem.slice(0, 50)}..."`);
  
  const workflowSteps = [];
  let currentContext = {};
  
  try {
    // Step 1: Environmental Problem Analyzer
    const analyzerResult = await runAnalyzerAgent(problem);
    workflowSteps.push(analyzerResult);
    
    // Step 2: Research Agent
    const researchResult = await runResearchAgent(analyzerResult);
    workflowSteps.push(researchResult);
    
    // Step 3: Solution Planner Agent
    const plannerResult = await runPlannerAgent(analyzerResult, researchResult);
    workflowSteps.push(plannerResult);
    
    // Step 4: Impact Assessment Agent
    const impactResult = await runImpactAgent(analyzerResult);
    workflowSteps.push(impactResult);
    
    // Step 5: Final Advisor Agent
    const advisorResult = await runAdvisorAgent(
      problem,
      analyzerResult,
      researchResult,
      plannerResult,
      impactResult
    );
    workflowSteps.push(advisorResult);

    // Collate final results
    res.json({
      success: true,
      inputProblem: problem,
      sector: analyzerResult.data.sector,
      scale: analyzerResult.data.scale,
      metrics: impactResult.data.metrics,
      timeline: plannerResult.data.timeline,
      references: researchResult.data.references,
      report: advisorResult.data.report,
      executiveSummary: advisorResult.data.executiveSummary,
      steps: workflowSteps.map(step => ({
        agentName: step.agentName,
        status: step.status,
        logs: step.logs
      }))
    });
    
    console.log(`[Server] Multi-agent collaboration completed successfully for query.`);
  } catch (error) {
    console.error(`[Server] Error during agent workflow execution:`, error);
    res.status(500).json({
      success: false,
      error: error.message,
      steps: workflowSteps.map(step => ({
        agentName: step.agentName,
        status: step.status,
        logs: step.logs
      })).concat([{
        agentName: "Orchestrator",
        status: "failed",
        logs: [`[Orchestrator] CRITICAL ERROR: ${error.message}`]
      }])
    });
  }
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  EcoSphere AI - Backend Server Active            `);
  console.log(`  Running offline at http://localhost:${PORT}      `);
  console.log(`==================================================`);
});
