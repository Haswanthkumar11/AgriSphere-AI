import client from './client';

/** Scan a leaf image for disease. Returns { healthy, disease_label, confidence, remedy }. */
export const scanLeaf = (imageFile, farmerId = 'usr_demo') => {
  const fd = new FormData();
  fd.append('file', imageFile, 'leaf.jpg');
  return client.post(`/api/v1/disease/scan?farmer_id=${farmerId}`, fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** Get voice advisory for a detected disease. */
export const dispatchVoiceAlert = (phone, languageCode, alertType, diseaseName) =>
  client.post('/api/v1/advisory/voice-dispatch', {
    farmer_phone: phone,
    language_code: languageCode,
    alert_type: alertType,
    disease_name: diseaseName,
  });
