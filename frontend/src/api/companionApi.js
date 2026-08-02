import client from './client';

/** Send message/prompt to AgriSphere Companion Agentic AI Backend. */
export const sendCompanionChat = (message, cropType = 'Paddy', city = 'Tirupati', userId = 'usr_demo', language = 'en') => {
  return client.post('/api/v1/companion/chat', {
    message,
    crop_type: cropType,
    city,
    user_id: userId,
    language,
  });
};
