import client from './client';

/** Submit a yield prediction request. */
export const predictYield = (payload) =>
  client.post('/api/v1/yield/predict', payload);

/** Get supported crop list. */
export const getSupportedCrops = () =>
  client.get('/api/v1/yield/crops');

/** Get yield prediction history. */
export const getYieldHistory = (userId) =>
  client.get(`/api/v1/yield/history?user_id=${userId}`);
