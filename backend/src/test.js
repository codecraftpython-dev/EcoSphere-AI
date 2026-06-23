import assert from 'assert';
import { validateInput } from './mcp/tools/validator.js';
import { searchKnowledgeBase } from './mcp/tools/knowledgeBase.js';
import { calculateImpact } from './mcp/tools/calculator.js';
import { runAnalyzerAgent } from './agents/analyzerAgent.js';
import { runResearchAgent } from './agents/researchAgent.js';
import { runPlannerAgent } from './agents/plannerAgent.js';
import { runImpactAgent } from './agents/impactAgent.js';
import { runAdvisorAgent } from './agents/advisorAgent.js';

async function runTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING ECOSPHERE AI TESTS...");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ Passed: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ Failed: ${name}`);
      console.error(err);
      failed++;
    }
  }

  async function testAsync(name, fn) {
    try {
      await fn();
      console.log(`✅ Passed (Async): ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ Failed (Async): ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. Validator Tests
  test("Validator - rejects too short inputs", () => {
    const res = validateInput("too short");
    assert.strictEqual(res.valid, false);
    assert.match(res.error, /too short/);
  });

  test("Validator - rejects script injections", () => {
    const res = validateInput("<script>alert('hack')</script> corporate office");
    assert.strictEqual(res.valid, false);
    assert.match(res.error, /Security Alert/);
  });

  test("Validator - sanitizes HTML tags", () => {
    const res = validateInput("Testing <div style='color:red'>html tag</div> in large building");
    assert.strictEqual(res.valid, true);
    assert.ok(res.sanitizedInput.includes("&lt;div"));
  });

  // 2. Knowledge Base Tests
  await testAsync("Knowledge Base - searches and tokenizes successfully", async () => {
    const res = await searchKnowledgeBase("We want to reduce compostable cafeteria waste in our municipal campus");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.fallback, false);
    assert.ok(res.matches.length > 0);
    assert.strictEqual(res.matches[0].sector, "Waste Management");
  });

  await testAsync("Knowledge Base - falls back gracefully on unrelated queries", async () => {
    const res = await searchKnowledgeBase("unrelated query with no matching keywords");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.fallback, true);
    assert.ok(res.matches.length > 0);
  });

  // 3. Calculator Tests
  test("Calculator - correctly computes Waste sector values", () => {
    const res = calculateImpact("Waste Management", "medium");
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.metrics.waste_diverted_tons_per_year, 120);
    assert.strictEqual(res.metrics.carbon_savings_tco2e_per_year, 102);
    assert.strictEqual(res.metrics.cost_savings_usd_per_year, 11400);
  });

  test("Calculator - scales values for small and large projects", () => {
    const smallRes = calculateImpact("Energy Efficiency", "small");
    const largeRes = calculateImpact("Energy Efficiency", "large");
    assert.ok(largeRes.metrics.energy_saved_kwh_per_year > smallRes.metrics.energy_saved_kwh_per_year);
    assert.strictEqual(largeRes.metrics.energy_saved_kwh_per_year, smallRes.metrics.energy_saved_kwh_per_year * 16);
  });

  // 4. Agent Pipeline Tests
  await testAsync("Agent Workflow Integration - executes entire pipeline sequentially", async () => {
    const problem = "Upgrade corporate office lighting to smart LEDs and install solar panels on factory roof";
    
    // Step 1: Analyzer
    const analyzer = await runAnalyzerAgent(problem);
    assert.strictEqual(analyzer.status, "completed");
    assert.strictEqual(analyzer.data.sector, "Energy Efficiency");
    
    // Step 2: Research
    const research = await runResearchAgent(analyzer);
    assert.strictEqual(research.status, "completed");
    assert.ok(research.data.guidelines.length > 0);
    
    // Step 3: Planner
    const planner = await runPlannerAgent(analyzer, research);
    assert.strictEqual(planner.status, "completed");
    assert.ok(planner.data.timeline.shortTerm.length > 0);
    
    // Step 4: Impact
    const impact = await runImpactAgent(analyzer);
    assert.strictEqual(impact.status, "completed");
    assert.ok(impact.data.metrics.carbon_savings_tco2e_per_year > 0);
    
    // Step 5: Final Advisor
    const advisor = await runAdvisorAgent(problem, analyzer, research, planner, impact);
    assert.strictEqual(advisor.status, "completed");
    assert.ok(advisor.data.report.includes("# EcoSphere AI"));
    assert.ok(advisor.data.executiveSummary.length > 10);
  });

  console.log("==================================================");
  console.log(`📊 TESTS SUMMARY: ${passed} Passed | ${failed} Failed`);
  console.log("==================================================");
  
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error("Critical Failure in Test Runner:", err);
  process.exit(1);
});
