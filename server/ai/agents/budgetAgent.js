/**
 * Budget Agent
 * Calculates, validates, and optimizes the trip budget against user constraints.
 */

import { budgetTool } from '../tools/budgetTool.js';

export class BudgetAgent {
  async run({ travelers = 2, duration = 4, targetBudget = null, travelStyle = 'Standard / Comfort', currency = 'INR' }) {
    const agentName = 'Budget Agent';
    const trace = {
      agent: agentName,
      status: 'completed',
      insights: []
    };

    const budgetCalculation = await budgetTool.execute({
      travelers,
      days: duration,
      travelStyle,
      currency
    });

    let budgetStatus = 'optimal';
    let budgetRecommendation = 'The trip is well-budgeted with healthy contingency buffers.';

    if (targetBudget && targetBudget > 0) {
      if (budgetCalculation.totalEstimatedCost > targetBudget * 1.15) {
        budgetStatus = 'tight';
        budgetRecommendation = `Estimated expense (₹${budgetCalculation.totalEstimatedCost.toLocaleString()}) exceeds target (₹${targetBudget.toLocaleString()}). Recommended selecting standard partner stays or public transit options.`;
      } else if (targetBudget > budgetCalculation.totalEstimatedCost * 1.4) {
        budgetStatus = 'surplus';
        budgetRecommendation = `Your budget allows room for luxury heritage upgrades or premium dining experiences.`;
      }
    }

    trace.insights.push(`Calculated estimated total cost of ₹${budgetCalculation.totalEstimatedCost.toLocaleString()} (${currency} ${budgetCalculation.costPerPerson.toLocaleString()} per traveler).`);
    trace.insights.push(`Budget status: ${budgetStatus}. ${budgetRecommendation}`);

    return {
      agent: agentName,
      estimatedBudget: targetBudget && targetBudget > 0 && Math.abs(targetBudget - budgetCalculation.totalEstimatedCost) < targetBudget * 0.25 
        ? Math.round((targetBudget * 0.9 + budgetCalculation.totalEstimatedCost * 0.1)) 
        : budgetCalculation.totalEstimatedCost,
      currency: budgetCalculation.currency,
      costPerPerson: budgetCalculation.costPerPerson,
      breakdown: budgetCalculation.breakdown,
      roomsNeeded: budgetCalculation.roomsNeeded,
      budgetStatus,
      budgetRecommendation,
      trace
    };
  }
}

export const budgetAgent = new BudgetAgent();
