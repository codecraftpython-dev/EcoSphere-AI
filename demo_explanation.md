# Antigravity Demo Walkthrough: Green Future Advisor AI 🪐

This document describes the step-by-step execution flow of the **Green Future Advisor AI** platform. It details the data transitions, tools invoked, and output formats as information flows from initial user input to the final sustainability advisory report.

---

## 🔄 Dynamic Workflow Walkthrough

### 1. User Input (Dashboard UI)
- **Action**: The user opens the dashboard and enters an environmental challenge in the text console (or selects a preset template).
- **Example Input**: 
  > *"Convert our corporate headquarter facility to use smart LED occupancy panels, upgrade natural gas boilers to electric heat pumps, and install rooftop solar PV panels."*
- **UI State**: The user clicks **Generate AI Advisory Report**. The dashboard transitions into the active scanning state, initiating progress animations and revealing the multi-agent console tracker.

---

### 2. Step 1: Environmental Problem Analyzer Agent
- **Goal**: Sanitize input, classify the sector domain, and estimate the project scale.
- **MCP Tool Invoked**: `verify_input_safety(userInput)`
- **Execution**: 
  - The security validator sanitizes the string and returns a safe payload.
  - The agent scans for terms like `solar`, `LED`, `gas boilers`, classifying the sector as `Energy Efficiency`.
  - The agent scans for `corporate headquarter facility`, classifying the project scale as `large`.
- **Output JSON Context**:
  ```json
  {
    "sanitizedInput": "Convert our corporate headquarter facility...",
    "sector": "Energy Efficiency",
    "scale": "large",
    "keyChallenges": [
      "Inefficient thermal envelope or HVAC consumption peaks",
      "Heavy reliance on fossil-fuel powered grid electricity"
    ]
  }
  ```

---

### 3. Step 2: Research Agent
- **Goal**: Query local documents for standards, benchmarks, and guidelines.
- **MCP Tool Invoked**: `get_documents(query)` where query is `"Energy Efficiency Convert our corporate headquarter..."`
- **Execution**:
  - The database tool splits the query and scores entries in `sustainability_db.json`.
  - It filters out stopwords (e.g. `our`, `to`, `and`) and scores `energy-eff-002` highest due to matches on `energy`, `solar`, and `hvac`.
  - It extracts guidelines and reference sources.
- **Output JSON Context**:
  ```json
  {
    "retrievedDocuments": [ { "id": "energy-eff-002", "sector": "Energy Efficiency", ... } ],
    "guidelines": [
      "Perform thermographic energy audits to locate insulation leaks.",
      "Install smart building management systems (BMS) with motion-sensor LED lighting.",
      "Transition from gas-fired heating to high-efficiency electric air-source heat pumps.",
      "Install rooftop solar panels combined with battery storage for peak shaving."
    ],
    "references": [
      "NREL Commercial Solar Deployment Guide (2024)",
      "ASHRAE Standard 90.1 for Energy Efficient Buildings"
    ]
  }
  ```

---

### 4. Step 3: Solution Planner Agent
- **Goal**: Translate the guidelines into a phased, practical timeline.
- **Execution**:
  - Takes the sector classification (`Energy Efficiency`) and scale (`large`).
  - Distributes the matching guidelines into Short-Term, Medium-Term, and Long-Term steps.
  - Computes CapEx estimates based on the `large` scale factor.
- **Output JSON Context**:
  ```json
  {
    "timeline": {
      "shortTerm": [
        {
          "title": "LED Lighting & Sensor Retrofit",
          "description": "Install smart building management systems (BMS) with motion-sensor LED lighting.",
          "difficulty": "Low",
          "duration": "1-3 Months",
          "costEstimate": "$12,000"
        },
        ...
      ],
      "mediumTerm": [
        {
          "title": "HVAC Upgrade to Heat Pumps",
          "description": "Transition from gas-fired heating to high-efficiency electric air-source heat pumps.",
          "difficulty": "High",
          "duration": "8-12 Months",
          "costEstimate": "$150,000"
        },
        ...
      ],
      "longTerm": [ ... ]
    }
  }
  ```

---

### 5. Step 4: Impact Assessment Agent
- **Goal**: Quantify ecological and cost savings.
- **MCP Tool Invoked**: `calculate_sustainability_impact(sector, scale)` where sector is `"Energy Efficiency"` and scale is `"large"`.
- **Execution**:
  - The calculator runs formulas using the `large` scale factor multiplier (`4.0`):
    - `energySaved` = 75,000 kWh * 4.0 = 300,000 kWh/yr.
    - `carbonSavings` = 300,000 kWh * 0.00042 tCO2e/kWh = 126 tCO2e/yr.
    - `costSavings` = 300,000 kWh * $0.15/kWh = $45,000/yr.
    - `payback` = 6.0 years.
- **Output JSON Context**:
  ```json
  {
    "metrics": {
      "carbon_savings_tco2e_per_year": 126,
      "water_savings_liters_per_year": 45000,
      "waste_diverted_tons_per_year": 0,
      "energy_saved_kwh_per_year": 300000,
      "cost_savings_usd_per_year": 45000,
      "payback_period_years": 6.0
    },
    "calculationsBreakdown": [
      "Energy Conserved: 300,000 kWh/year (75,000 kWh base * scale factor 4)",
      "Carbon Abated: 126.0 tCO2e/year using grid intensity (0.42 kg CO2e/kWh)",
      "Utility Cost Reduction: $45,000/year at industrial rate ($0.15/kWh)"
    ]
  }
  ```

---

### 6. Step 5: Final Advisor Agent
- **Goal**: Synthesize a markdown report and executive summary.
- **Execution**:
  - Blends the structured JSON outputs from all preceding steps into a narrative Markdown document.
  - Adds summary bullet cards and verified references.
- **Output JSON Context**:
  ```json
  {
    "report": "# Green Future Advisor AI - Sustainability Report\n\n## Executive Summary\n...",
    "executiveSummary": "The analysis identified 2 core challenges in the Energy Efficiency sector. By deploying..."
  }
  ```

---

### 7. UI Presentation (Dashboard Rendering)
- **Completed State**: The backend returns the aggregated JSON. The frontend completes its timer step animation and releases the loading screen.
- **Rendering**:
  - The **Advisory Report** tab displays the formatted markdown using our custom fast parser.
  - The **Action Timeline** renders cards for each phase along with difficulty badges.
  - The **Impact Summary** displays carbon savings, water savings, energy savings, and financial payback in bright glowing cards with animated progress bars.
  - The **References** tab lists NREL and ASHRAE source citations.
  - The **Status Tracker** displays green checkmarks beside all five agents, allowing users to expand the boxes and read the logs from each agent's execution.
