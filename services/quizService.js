import api from './api';

// Get all quizzes for the lecturer
export const getQuizzes = async () => {
  try {
    const response = await api.get('/quizzes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get a single quiz by ID
export const getQuizById = async (id) => {
  try {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Create a new quiz
export const createQuiz = async (quizData) => {
  try {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update a quiz
export const updateQuiz = async (id, quizData) => {
  try {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Delete a quiz
export const deleteQuiz = async (id) => {
  try {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Publish quiz results
export const publishQuizResults = async (quizId) => {
  try {
    const response = await api.put(`/quizzes/${quizId}/publish-results`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};