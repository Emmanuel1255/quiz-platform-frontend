// In client/src/services/resultsService.js

import api from './api';

// Get all attempts for a specific quiz
export const getAllAttempts = async (quizId) => {
  try {
    const response = await api.get(`/quizzes/${quizId}/attempts`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get a single attempt details
export const getAttemptDetails = async (attemptId) => {
  try {
    const response = await api.get(`/attempts/${attemptId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Publish quiz results (this can also go in quizService.js if you prefer)
export const publishQuizResults = async (quizId) => {
  try {
    const response = await api.put(`/quizzes/${quizId}/publish-results`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Export quiz results as CSV
export const exportQuizResults = async (quizId, format = 'csv') => {
  try {
    const response = await api.get(`/quizzes/${quizId}/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};