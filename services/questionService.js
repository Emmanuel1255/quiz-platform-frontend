import api from './api';

// Add a question to a quiz
export const addQuestion = async (quizId, questionData) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Update a question
export const updateQuestion = async (id, questionData) => {
  try {
    const response = await api.put(`/questions/${id}`, questionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Delete a question
export const deleteQuestion = async (id) => {
  try {
    const response = await api.delete(`/questions/${id}`);
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

// Bulk upload questions
export const bulkUploadQuestions = async (quizId, formData) => {
  try {
    const response = await api.post(`/questions/${quizId}/questions/bulk-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};