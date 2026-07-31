import client from './client';

/** List available equipment near the farmer. */
export const listEquipment = () => client.get('/api/v1/rentals/equipment');

/** Book a piece of equipment. */
export const bookEquipment = (equipmentId, farmerId = 'usr_demo') =>
  client.post('/api/v1/rentals/book', { equipment_id: equipmentId, farmer_id: farmerId });

/** Get booking history for a farmer. */
export const getBookingHistory = (farmerId = 'usr_demo') =>
  client.get(`/api/v1/rentals/history?farmer_id=${farmerId}`);
