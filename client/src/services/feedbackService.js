import api from './api';

export const submitFeedback = async (complaintId, data) => {
  const response = await api.post(`/feedback/${complaintId}`, data);
  return response.data;
};

export const getFeedbackForComplaint = async (complaintId) => {
  const response = await api.get(`/feedback/complaint/${complaintId}`);
  return response.data;
};

export const getFeedbackAnalytics = async () => {
  const response = await api.get('/feedback/analytics');
  return response.data;
};
