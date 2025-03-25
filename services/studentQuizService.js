import api from './api';

// Get all published quizzes
export const getPublishedQuizzes = async () => {
  try {
    const response = await api.get('/student/quizzes');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get details for a specific quiz
export const getQuizDetails = async (quizId) => {
  try {
    const response = await api.get(`/student/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Start a new quiz attempt
export const startQuizAttempt = async (quizId) => {
  try {
    const response = await api.post(`/student/quizzes/${quizId}/start`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Save an answer
export const saveAnswer = async (attemptId, questionId, selectedOptions) => {
  try {
    const response = await api.put(`/student/attempts/${attemptId}/answer`, {
      questionId,
      selectedOptions,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Submit a quiz attempt
export const submitQuizAttempt = async (attemptId, submissionReason = 'manual') => {
  try {
    const response = await api.put(`/student/attempts/${attemptId}/submit`, {
      submissionReason,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Register time away
export const registerTimeAway = async (attemptId, action) => {
  try {
    const response = await api.put(`/student/attempts/${attemptId}/away`, {
      action,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

// Get attempt results
export const getAttemptResults = async (attemptId) => {
  try {
    const response = await api.get(`/student/attempts/${attemptId}/results`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Network error' };
  }
};

export const getQuizAttemptById = async (attemptId) => {
    try {
      const response = await api.get(`/student/attempts/${attemptId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : { message: 'Network error' };
    }
  };