/**
 * Sustainability Impact Calculator Tool
 * Exposes methods to calculate environmental and economic benefits.
 */

/**
 * Calculates impact estimates based on the analyzed sector and project scale
 * @param {string} sector - Waste Management, Energy Efficiency, Water Conservation, Sustainable Transportation
 * @param {string} scale - small, medium, large
 * @param {number} [customMetricMultiplier=1.0] - Optional factor
 * @returns {Object} Calculated impact metrics
 */
export function calculateImpact(sector, scale = 'medium', customMetricMultiplier = 1.0) {
  // Define base multipliers based on project scale
  let scaleFactor = 1.0;
  if (scale === 'small') scaleFactor = 0.25;
  if (scale === 'large') scaleFactor = 4.0;
  
  scaleFactor *= customMetricMultiplier;

  let carbonSavings = 0; // tCO2e/year
  let waterSavings = 0;  // Liters/year
  let wasteDiverted = 0; // Tons/year
  let energySaved = 0;   // kWh/year
  let costSavings = 0;   // USD/year
  let paybackPeriod = 0; // Years
  let calculationsBreakdown = [];

  const normalizedSector = (sector || '').trim().toLowerCase();

  if (normalizedSector.includes('waste')) {
    wasteDiverted = 120 * scaleFactor;
    carbonSavings = wasteDiverted * 0.85; // 0.85 tons CO2 saved per ton waste composted/recycled
    costSavings = wasteDiverted * 95; // $95 saved per ton in landfill tipping fees and circular resale
    energySaved = wasteDiverted * 150; // Embedded energy saved in circular manufacturing (150 kWh/ton)
    paybackPeriod = scale === 'small' ? 1.5 : scale === 'large' ? 3.5 : 2.5;

    calculationsBreakdown = [
      `Waste Diverted: ${wasteDiverted.toFixed(1)} tons/year (calculated as 120 tons base * scale factor ${scaleFactor})`,
      `Carbon Abated: ${carbonSavings.toFixed(1)} tCO2e/year based on EPA factor of 0.85 tCO2e/ton of diverted waste`,
      `Financial Return: $${costSavings.toLocaleString(undefined, {maximumFractionDigits:0})}/year from reduced municipal tipping fees ($95/ton)`
    ];
  } else if (normalizedSector.includes('energy') || normalizedSector.includes('power') || normalizedSector.includes('solar')) {
    energySaved = 75000 * scaleFactor; // kWh saved/year
    carbonSavings = energySaved * 0.00042; // 0.42 kg CO2 per kWh
    waterSavings = energySaved * 0.15; // 0.15 L water saved per kWh (reduced power plant cooling)
    costSavings = energySaved * 0.15; // $0.15 average commercial rate per kWh
    paybackPeriod = scale === 'small' ? 3.0 : scale === 'large' ? 6.0 : 4.5;

    calculationsBreakdown = [
      `Energy Conserved: ${energySaved.toLocaleString(undefined, {maximumFractionDigits:0})} kWh/year (75,000 kWh base * scale factor ${scaleFactor})`,
      `Carbon Abated: ${carbonSavings.toFixed(1)} tCO2e/year using standard grid intensity coefficient (0.42 kg CO2e/kWh)`,
      `Utility Cost Reduction: $${costSavings.toLocaleString(undefined, {maximumFractionDigits:0})}/year at standard industrial-rate ($0.15/kWh)`
    ];
  } else if (normalizedSector.includes('water')) {
    waterSavings = 2500000 * scaleFactor; // Liters saved/year
    costSavings = (waterSavings / 1000) * 3.50; // $3.50 per 1000 Liters (supply + sewerage fees)
    carbonSavings = (waterSavings / 1000) * 0.28; // 0.28 kg CO2 per kL of treated municipal water transport
    wasteDiverted = scaleFactor * 5; // Sludge reduction at treatment site
    paybackPeriod = scale === 'small' ? 2.0 : scale === 'large' ? 5.0 : 3.0;

    calculationsBreakdown = [
      `Water Conserved: ${waterSavings.toLocaleString()} Liters/year (2.5M liters base * scale factor ${scaleFactor})`,
      `Municipal Water Abatement Cost: $${costSavings.toLocaleString(undefined, {maximumFractionDigits:0})}/year (utility rate of $3.50 per cubic meter)`,
      `Carbon Reductions: ${carbonSavings.toFixed(2)} tCO2e/year saved in municipal water treatment and pumping electricity (0.28 kg CO2e/kL)`
    ];
  } else if (normalizedSector.includes('transport') || normalizedSector.includes('fleet') || normalizedSector.includes('car') || normalizedSector.includes('ev')) {
    const fleetMileage = 150000 * scaleFactor; // Total fleet km/year replaced
    carbonSavings = fleetMileage * 0.00012; // 120 grams CO2e saved per km vs combustion engines
    energySaved = fleetMileage * 0.2; // 0.2 kWh electricity needed per km vs fuel
    costSavings = fleetMileage * 0.08; // Net savings: $0.08 per km (lower fuel + maintenance costs for EVs)
    paybackPeriod = scale === 'small' ? 2.5 : scale === 'large' ? 5.5 : 4.0;

    calculationsBreakdown = [
      `Clean Mileage Replaced: ${fleetMileage.toLocaleString()} km/year of fleet travel converted to Battery EV`,
      `Carbon Abated: ${carbonSavings.toFixed(1)} tCO2e/year based on avoiding 120g CO2e/km combustion emissions`,
      `Fuel & Maintenance Savings: $${costSavings.toLocaleString(undefined, {maximumFractionDigits:0})}/year net reduction ($0.08/km savings)`
    ];
  } else {
    // Blended general sustainability defaults
    carbonSavings = 15 * scaleFactor;
    waterSavings = 100000 * scaleFactor;
    wasteDiverted = 10 * scaleFactor;
    energySaved = 20000 * scaleFactor;
    costSavings = 5000 * scaleFactor;
    paybackPeriod = 3.5;

    calculationsBreakdown = [
      `Carbon Reduction: ${carbonSavings.toFixed(1)} tCO2e/year (General default index)`,
      `Water Saved: ${waterSavings.toLocaleString()} Liters/year`,
      `Waste Diverted: ${wasteDiverted.toFixed(1)} tons/year`,
      `Utility Cost Reduction: $${costSavings.toLocaleString()}/year`
    ];
  }

  return {
    success: true,
    metrics: {
      carbon_savings_tco2e_per_year: Number(carbonSavings.toFixed(2)),
      water_savings_liters_per_year: Math.round(waterSavings),
      waste_diverted_tons_per_year: Number(wasteDiverted.toFixed(2)),
      energy_saved_kwh_per_year: Math.round(energySaved),
      cost_savings_usd_per_year: Math.round(costSavings),
      payback_period_years: Number(paybackPeriod.toFixed(1))
    },
    scale,
    sector,
    calculationsBreakdown
  };
}

export default {
  calculateImpact
};
