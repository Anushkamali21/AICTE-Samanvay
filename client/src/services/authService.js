import api from './api';

export const requestOtp = async (identifier) => {
  const response = await api.post('/auth/request-otp', { identifier });
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post('/auth/verify-otp', data);
  return response.data;
};

export const demoLogin = async (role) => {
  const response = await api.post('/auth/demo-login', { role });
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
