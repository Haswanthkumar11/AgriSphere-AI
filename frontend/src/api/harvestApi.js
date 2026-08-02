import client from './client';

/** Analyze grain sample photo & create harvest session. */
export const analyzeHarvestGrain = (imageFile, cropType = 'Paddy', modelKey = 'opencv', userId = 'usr_demo') => {
  const fd = new FormData();
  fd.append('file', imageFile, 'grain_sample.jpg');
  fd.append('crop_type', cropType);
  fd.append('model_key', modelKey);
  fd.append('user_id', userId);
  return client.post('/api/v1/harvest/analyze', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Get harvest check history list. */
export const getHarvestHistory = (userId = 'usr_demo', cropType = null) => {
  const params = new URLSearchParams({ user_id: userId });
  if (cropType) params.append('crop_type', cropType);
  return client.get(`/api/v1/harvest/history?${params.toString()}`);
};

/** Get single harvest session detail. */
export const getHarvestSessionDetail = (sessionId) =>
  client.get(`/api/v1/harvest/session/${sessionId}`);

/** Soft delete harvest session. */
export const deleteHarvestSession = (sessionId) =>
  client.delete(`/api/v1/harvest/session/${sessionId}`);

/** Get official Grain Quality Passport by passport_id or session_id. */
export const getGrainPassport = (identifier) =>
  client.get(`/api/v1/harvest/passport/${identifier}`);

/** Get storage advice detail. */
export const getStorageAdvice = (sessionId) =>
  client.get(`/api/v1/harvest/storage/${sessionId}`);

/** Get selling advice detail. */
export const getMarketAdvice = (sessionId) =>
  client.get(`/api/v1/harvest/market/${sessionId}`);

/** Compare 2 harvest sessions side-by-side. */
export const compareHarvests = (sessionId1, sessionId2) =>
  client.post('/api/v1/harvest/compare', {
    session_id_1: sessionId1,
    session_id_2: sessionId2,
  });

/** List grain guide standards & parameters. */
export const getHarvestKnowledgeBase = () =>
  client.get('/api/v1/harvest/knowledge-base');

/** Download official AGMARK Grain Quality Passport PDF Report. */
export const downloadGrainReport = (sessionId) => {
  const baseURL = import.meta.env.VITE_API_BASE || '';
  window.open(`${baseURL}/api/v1/harvest/report/${sessionId}`, '_blank');
};
