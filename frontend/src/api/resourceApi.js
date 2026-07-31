import client from './client';

/** Equipment Marketplace Endpoints */
export const listEquipment = (params = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.district) query.append('district', params.district);
  if (params.village) query.append('village', params.village);
  if (params.operator_available !== undefined) query.append('operator_available', params.operator_available);
  if (params.sort_by) query.append('sort_by', params.sort_by);
  return client.get(`/api/v1/resources/equipment?${query.toString()}`);
};

export const getEquipmentDetail = (id) =>
  client.get(`/api/v1/resources/equipment/${id}`);

export const createEquipment = (data) =>
  client.post('/api/v1/resources/equipment', data);

export const toggleEquipmentAvailability = (id) =>
  client.put(`/api/v1/resources/equipment/${id}/toggle-availability`);

export const deleteEquipment = (id) =>
  client.delete(`/api/v1/resources/equipment/${id}`);

/** Booking Endpoints */
export const submitBooking = (data) =>
  client.post('/api/v1/resources/book', data);

export const getFarmerBookings = (userId = 'usr_demo') =>
  client.get(`/api/v1/resources/bookings?requester_id=${userId}`);

export const getOwnerRequests = (ownerId = 'usr_demo') =>
  client.get(`/api/v1/resources/owner/requests?owner_id=${ownerId}`);

export const getOwnerDashboard = (ownerId = 'usr_demo') =>
  client.get(`/api/v1/resources/owner/dashboard?owner_id=${ownerId}`);

export const acceptBooking = (id) =>
  client.put(`/api/v1/resources/bookings/${id}/accept`);

export const rejectBooking = (id) =>
  client.put(`/api/v1/resources/bookings/${id}/reject`);

export const completeBooking = (id) =>
  client.put(`/api/v1/resources/bookings/${id}/complete`);

export const getRentalConfirmation = (id) =>
  client.get(`/api/v1/resources/bookings/${id}/confirmation`);

/** Notification Endpoints */
export const getNotifications = (userId = 'usr_demo') =>
  client.get(`/api/v1/resources/notifications?user_id=${userId}`);

export const markNotificationRead = (id) =>
  client.put(`/api/v1/resources/notifications/${id}/read`);

export const markAllNotificationsRead = (userId = 'usr_demo') =>
  client.put(`/api/v1/resources/notifications/read-all?user_id=${userId}`);
