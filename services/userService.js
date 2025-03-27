// In services/userService.js
import api from './api';

// Get all students (for lecturers)
export const getAllStudents = async () => {
  try {
    const response = await api.get('/users/students');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Export students as CSV
export const exportStudentsAsCSV = async () => {
  try {
    const response = await api.get('/users/students/export', {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};