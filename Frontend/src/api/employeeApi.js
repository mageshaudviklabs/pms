import apiClient from './index';

export const fetchEmployees = async () => {
  try {
    const response = await apiClient.get('/employees');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const response = await apiClient.get(`/employees/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await apiClient.put(`/employees/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};