import client from './client';

/** Get mandi prices for all crops. */
export const getPrices = () => client.get('/api/v1/prices');

/** Get market overview (Module 2). */
export const getMarketOverview = () => client.get('/api/v1/market/overview');

/** Get AI market prediction for a specific crop. */
export const getMarketPrediction = (crop) =>
  client.get(`/api/v1/market/predict?crop=${encodeURIComponent(crop)}`);

/** Get 7-day price forecast for a crop. */
export const getPriceForecast = (crop, days = 7) =>
  client.get(`/api/v1/market/forecast?crop=${encodeURIComponent(crop)}&days=${days}`);
