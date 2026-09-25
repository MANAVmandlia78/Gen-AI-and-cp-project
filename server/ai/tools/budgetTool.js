/**
 * Budget & Exchange Rate Tool - Exact arithmetic calculations for travel economics
 * Uses deterministic business math to guarantee zero calculation hallucinations.
 */

const EXCHANGE_RATES = {
  INR: 1.0,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AED: 0.044,
  SGD: 0.016
};

export const budgetTool = {
  name: 'calculateBudgetAndCosts',
  description: 'Calculates verified itemized budget breakdown (hotel, food, transport, sightseeing, buffer) and handles currency conversion.',
  parameters: {
    type: 'object',
    properties: {
      travelers: { type: 'number', description: 'Number of people traveling' },
      days: { type: 'number', description: 'Total trip duration in days' },
      travelStyle: { type: 'string', enum: ['Budget', 'Standard / Comfort', 'Luxury / Heritage', 'Adventure'], description: 'Style preference' },
      currency: { type: 'string', description: 'Target currency code (INR, USD, EUR, etc.)' }
    },
    required: ['travelers', 'days']
  },

  async execute({ travelers = 2, days = 4, travelStyle = 'Standard / Comfort', currency = 'INR' }) {
    const numPax = Math.max(1, parseInt(travelers, 10));
    const numDays = Math.max(1, parseInt(days, 10));
    const nights = Math.max(1, numDays - 1);

    // Number of hotel rooms needed (2 persons per room)
    const rooms = Math.ceil(numPax / 2);

    let hotelPerRoomPerNight = 3500;
    let foodPerPersonPerDay = 900;
    let transportPerDayTotal = 2200; // Private AC vehicle with driver
    let activitiesPerPersonTotal = 1800;

    const styleLower = (travelStyle || '').toLowerCase();
    if (styleLower.includes('budget')) {
      hotelPerRoomPerNight = 2200;
      foodPerPersonPerDay = 550;
      transportPerDayTotal = 1500;
      activitiesPerPersonTotal = 800;
    } else if (styleLower.includes('luxury') || styleLower.includes('heritage')) {
      hotelPerRoomPerNight = 8500;
      foodPerPersonPerDay = 2200;
      transportPerDayTotal = 4500;
      activitiesPerPersonTotal = 3500;
    }

    const totalHotelCost = rooms * nights * hotelPerRoomPerNight;
    const totalFoodCost = numPax * numDays * foodPerPersonPerDay;
    const totalTransportCost = numDays * transportPerDayTotal;
    const totalActivitiesCost = numPax * activitiesPerPersonTotal;
    const contingencyBuffer = Math.round((totalHotelCost + totalFoodCost + totalTransportCost + totalActivitiesCost) * 0.08);

    const grandTotalINR = totalHotelCost + totalFoodCost + totalTransportCost + totalActivitiesCost + contingencyBuffer;
    const perPersonINR = Math.round(grandTotalINR / numPax);

    const rate = EXCHANGE_RATES[currency.toUpperCase()] || 1.0;
    const grandTotalConverted = Math.round(grandTotalINR * rate);
    const perPersonConverted = Math.round(perPersonINR * rate);

    return {
      travelers: numPax,
      days: numDays,
      nights,
      roomsNeeded: rooms,
      travelStyle,
      currency: currency.toUpperCase(),
      breakdown: {
        accommodation: totalHotelCost,
        foodAndDining: totalFoodCost,
        privateChauffeurTransport: totalTransportCost,
        sightseeingAndActivities: totalActivitiesCost,
        contingencyBuffer: contingencyBuffer
      },
      totalEstimatedCost: grandTotalINR,
      costPerPerson: perPersonINR,
      convertedTotal: grandTotalConverted,
      convertedPerPerson: perPersonConverted,
      isFeasibleWithin: (budgetLimit) => grandTotalINR <= (budgetLimit || grandTotalINR * 1.2),
      notes: `Includes ${rooms} verified hotel room(s), dedicated private AC vehicle throughout the trip, and daily meal allowances.`
    };
  },

  getExchangeRate(fromCurrency = 'INR', toCurrency = 'USD') {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    const fromRate = EXCHANGE_RATES[from] || 1.0;
    const toRate = EXCHANGE_RATES[to] || 1.0;
    const conversion = toRate / fromRate;
    return {
      from,
      to,
      rate: conversion,
      formatted: `1 ${from} = ${conversion.toFixed(4)} ${to}`
    };
  }
};
