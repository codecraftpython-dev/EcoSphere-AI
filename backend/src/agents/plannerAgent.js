/**
 * Solution Planner Agent
 * Core Role: Develop structured, phased project milestones.
 */
export async function runPlannerAgent(analyzerResult, researchResult) {
  const agentName = "Solution Planner Agent";
  const logs = [];
  
  const { sector, scale } = analyzerResult.data;
  const { guidelines } = researchResult.data;
  
  logs.push(`[${agentName}] Devising action plan for ${sector} (${scale} scale)...`);

  // Create a structured timeline of events
  const timeline = {
    shortTerm: [],  // 0 - 6 Months
    mediumTerm: [], // 6 - 18 Months
    longTerm: []    // 18+ Months
  };

  // Define steps depending on sector and scale
  if (sector === "Waste Management") {
    timeline.shortTerm.push({
      title: "Establish Waste Audits & Baselines",
      description: "Deploy internal tracking spreadsheets or sensor bins to classify current trash outputs.",
      difficulty: "Low",
      duration: "1-2 Months",
      costEstimate: scale === "small" ? "$50" : scale === "large" ? "$5000" : "$800"
    });
    timeline.shortTerm.push({
      title: "Implement Source Separation bins",
      description: guidelines[0] || "Install separate collection stations for organic waste, compostables, and plastics.",
      difficulty: "Low",
      duration: "3 Months",
      costEstimate: scale === "small" ? "$100" : scale === "large" ? "$3000" : "$600"
    });
    
    timeline.mediumTerm.push({
      title: "Partnership and Composting Launch",
      description: guidelines[1] || "Establish contract with municipal compost service or install an on-site anaerobic composting facility.",
      difficulty: "Medium",
      duration: "6-12 Months",
      costEstimate: scale === "small" ? "$300" : scale === "large" ? "$45000" : "$4500"
    });
    timeline.mediumTerm.push({
      title: "Packaging Material Redesign",
      description: guidelines[2] || "Replace standard plastic shrink-wraps and shipping buffers with biodegradable alternatives.",
      difficulty: "High",
      duration: "12 Months",
      costEstimate: scale === "small" ? "$50" : scale === "large" ? "$25000" : "$2000"
    });

    timeline.longTerm.push({
      title: "Closed-Loop Take-Back System",
      description: guidelines[3] || "Initiate circular take-back operations for product packaging, reclaiming post-consumer recyclables.",
      difficulty: "High",
      duration: "18-24 Months",
      costEstimate: scale === "small" ? "$200" : scale === "large" ? "$80000" : "$9500"
    });
  } else if (sector === "Energy Efficiency") {
    timeline.shortTerm.push({
      title: "LED Lighting & Sensor Retrofit",
      description: guidelines[1] || "Upgrade fixtures to energy-efficient LED panels integrated with occupancy controls.",
      difficulty: "Low",
      duration: "1-3 Months",
      costEstimate: scale === "small" ? "$150" : scale === "large" ? "$12000" : "$1500"
    });
    timeline.shortTerm.push({
      title: "BMS Smart Thermostat Deployment",
      description: "Set temperature-rollback timers for HVAC systems during unoccupied night/weekend hours.",
      difficulty: "Low",
      duration: "2 Months",
      costEstimate: scale === "small" ? "$250" : scale === "large" ? "$8000" : "$1200"
    });

    timeline.mediumTerm.push({
      title: "HVAC Upgrade to Heat Pumps",
      description: guidelines[2] || "Decommission aging natural gas heating systems, substituting air-source heat pumps.",
      difficulty: "High",
      duration: "8-12 Months",
      costEstimate: scale === "small" ? "$2500" : scale === "large" ? "$150000" : "$18000"
    });
    timeline.mediumTerm.push({
      title: "Rooftop Solar PV Installation",
      description: "Install solar panels across clear roof regions to offset daytime load spikes.",
      difficulty: "High",
      duration: "12-18 Months",
      costEstimate: scale === "small" ? "$8000" : scale === "large" ? "$300000" : "$45000"
    });

    timeline.longTerm.push({
      title: "Battery Storage & Peak-Shaving Integration",
      description: guidelines[3] || "Add lithium-iron-phosphate battery buffers to capture excess solar power for discharge during peak tariff hours.",
      difficulty: "High",
      duration: "24 Months",
      costEstimate: scale === "small" ? "$5000" : scale === "large" ? "$180000" : "$22000"
    });
  } else if (sector === "Water Conservation") {
    timeline.shortTerm.push({
      title: "Plumbing Fixture Upgrades",
      description: guidelines[3] || "Swap existing utility taps for sensor-actuated low-flow faucets and dual-flush toilets.",
      difficulty: "Low",
      duration: "1-2 Months",
      costEstimate: scale === "small" ? "$200" : scale === "large" ? "$14000" : "$2200"
    });
    timeline.shortTerm.push({
      title: "Facility Leak Audit & Sub-Metering",
      description: guidelines[0] || "Install telemetry-enabled smart sub-meters on high-draw pipes to detect micro-leaks.",
      difficulty: "Medium",
      duration: "3 Months",
      costEstimate: scale === "small" ? "$150" : scale === "large" ? "$9000" : "$1400"
    });

    timeline.mediumTerm.push({
      title: "Rainwater Harvesting Network",
      description: guidelines[2] || "Construct rooftop gutter networks routing precipitation into filtering storage cisterns.",
      difficulty: "Medium",
      duration: "6-12 Months",
      costEstimate: scale === "small" ? "$800" : scale === "large" ? "$55000" : "$6800"
    });

    timeline.longTerm.push({
      title: "Greywater Treatment & Recirculation",
      description: guidelines[1] || "Configure settling tanks and sand filters to scrub wastewater for reuse in heating towers and landscaping.",
      difficulty: "High",
      duration: "18-24 Months",
      costEstimate: scale === "small" ? "$1800" : scale === "large" ? "$120000" : "$15000"
    });
  } else if (sector === "Sustainable Transportation") {
    timeline.shortTerm.push({
      title: "Green Commuting Benefit Programs",
      description: guidelines[2] || "Distribute transit passes and set up bike rack areas with internal challenges to encourage carpooling.",
      difficulty: "Low",
      duration: "1-2 Months",
      costEstimate: scale === "small" ? "$0" : scale === "large" ? "$15000" : "$1200"
    });
    timeline.shortTerm.push({
      title: "Commute Mileage Audits & Hybrid Operations",
      description: guidelines[3] || "Introduce telecommuting policies (e.g. 2 days remote work) to suppress annual commute miles.",
      difficulty: "Low",
      duration: "2 Months",
      costEstimate: scale === "small" ? "$0" : scale === "large" ? "$5000" : "$500"
    });

    timeline.mediumTerm.push({
      title: "EV Smart Charger Deployments",
      description: guidelines[1] || "Install Level 2 smart charging stands powered by a clean renewable energy contract.",
      difficulty: "Medium",
      duration: "6-12 Months",
      costEstimate: scale === "small" ? "$1200" : scale === "large" ? "$48000" : "$6500"
    });

    timeline.longTerm.push({
      title: "Full Fleet Electrification",
      description: guidelines[0] || "Phase out combustion pool cars, replacing them with standard battery electric models.",
      difficulty: "High",
      duration: "18-36 Months",
      costEstimate: scale === "small" ? "$35000" : scale === "large" ? "$850000" : "$95000"
    });
  } else {
    // Default fallback planning steps
    timeline.shortTerm.push({
      title: "Audit Resource Streams",
      description: "Benchmark overall energy, water, and raw material intakes to detect obvious losses.",
      difficulty: "Low",
      duration: "2 Months",
      costEstimate: "$500"
    });
    timeline.mediumTerm.push({
      title: "Deploy Circular Solutions",
      description: "Upgrade components to recyclable designs and establish local conservation groups.",
      difficulty: "Medium",
      duration: "9 Months",
      costEstimate: "$3000"
    });
    timeline.longTerm.push({
      title: "Net-Zero Accreditation Certification",
      description: "Engage external audit teams to certify zero-waste or carbon neutrality status.",
      difficulty: "High",
      duration: "20 Months",
      costEstimate: "$10000"
    });
  }

  logs.push(`[${agentName}] Generated a timeline with ${timeline.shortTerm.length + timeline.mediumTerm.length + timeline.longTerm.length} action milestones.`);
  logs.push(`[${agentName}] Planning process complete.`);

  return {
    agentName,
    status: "completed",
    data: {
      timeline
    },
    logs
  };
}

export default {
  runPlannerAgent
};
