import client from './client';

export const loginFarmer = (phone, password) =>
  client.post('/api/v1/auth/login', { phone, password });

export const loginAdmin = (phone, password) =>
  client.post('/api/v1/auth/admin-login', { phone, password });

export const registerUser = (payload) =>
  client.post('/api/v1/auth/register', payload);

export const getProfile = () =>
  client.get('/api/v1/auth/me');

export const updateProfile = (payload) =>
  client.put('/api/v1/auth/me', payload);

export const changePassword = (currentPassword, newPassword) =>
  client.post('/api/v1/auth/change-password', { current_password: currentPassword, new_password: newPassword });

export const getUsers = () =>
  client.get('/api/v1/auth/users');
