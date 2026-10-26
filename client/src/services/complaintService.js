import api from './api';

export const createComplaint = async (data) => {
  const response = await api.post('/complaints', data);
  return response.data;
};

export const getMyComplaints = async (params = {}) => {
  const response = await api.get('/complaints/my', { params });
  return response.data;
};

export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

export const getPublicStatus = async (referenceId) => {
  const response = await api.get(`/complaints/public/${referenceId}`);
  return response.data;
};

export const addNote = async (id, note) => {
  const response = await api.post(`/complaints/${id}/notes`, { note });
  return response.data;
};

export const uploadDocument = async (id, formData) => {
  const response = await api.post(`/complaints/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const requestReopen = async (id, reason) => {
  const response = await api.post(`/complaints/${id}/reopen`, { reason });
  return response.data;
};

export const checkDuplicates = async (data) => {
  const response = await api.post('/complaints/check-duplicates', data);
  return response.data;
};

// Administrative operations
export const getAdminComplaints = async (params = {}) => {
  const response = await api.get('/admin/complaints', { params });
  return response.data;
};

export const updateComplaintStatus = async (id, newStatus, explanation) => {
  const response = await api.patch(`/admin/complaints/${id}/status`, { newStatus, explanation });
  return response.data;
};

export const assignComplaint = async (id, data) => {
  const response = await api.patch(`/admin/complaints/${id}/assignment`, data);
  return response.data;
};

export const linkComplaints = async (id, targetReferenceId, reason) => {
  const response = await api.post(`/admin/complaints/${id}/link`, { targetReferenceId, reason });
  return response.data;
};

export const escalateComplaint = async (id, reason) => {
  const response = await api.post(`/admin/complaints/${id}/escalate`, { reason });
  return response.data;
};

export const submitInstitutionResponse = async (id, responseText) => {
  const response = await api.post(`/admin/complaints/${id}/response`, { response: responseText });
  return response.data;
};

export const resolveComplaint = async (id, summary) => {
  const response = await api.post(`/admin/complaints/${id}/resolve`, { summary });
  return response.data;
};
