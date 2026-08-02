import client from './client';

/** Scan a leaf image & start an AI session. */
export const scanCrop = (imageFile, cropType = 'Tomato', modelKey = 'yolov8', userId = 'usr_demo') => {
  const fd = new FormData();
  fd.append('file', imageFile, 'leaf.jpg');
  fd.append('crop_type', cropType);
  fd.append('model_key', modelKey);
  fd.append('user_id', userId);
  return client.post('/api/v1/crop/scan', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Get scan history list. */
export const getScanHistory = (userId = 'usr_demo', cropType = null) => {
  const params = new URLSearchParams({ user_id: userId });
  if (cropType) params.append('crop_type', cropType);
  return client.get(`/api/v1/crop/history?${params.toString()}`);
};

/** Get single AI session detail. */
export const getSessionDetail = (sessionId) =>
  client.get(`/api/v1/crop/session/${sessionId}`);

/** Soft delete an AI session. */
export const deleteSession = (sessionId) =>
  client.delete(`/api/v1/crop/session/${sessionId}`);

/** Side-by-side session comparison. */
export const compareSessions = (sessionId1, sessionId2) =>
  client.post('/api/v1/crop/compare', {
    session_id_1: sessionId1,
    session_id_2: sessionId2,
  });

/** List all disease knowledge base entries. */
export const getKnowledgeBase = () =>
  client.get('/api/v1/crop/knowledge-base');

/** Get single disease knowledge card. */
export const getDiseaseCard = (diseaseCode) =>
  client.get(`/api/v1/crop/knowledge-base/${diseaseCode}`);

/** Download official ICAR & AgriSphere AI Crop Diagnostic PDF Report. */
export const downloadCropReport = (sessionId) => {
  const baseURL = import.meta.env.VITE_API_BASE || '';
  window.open(`${baseURL}/api/v1/crop/report/${sessionId}`, '_blank');
};
