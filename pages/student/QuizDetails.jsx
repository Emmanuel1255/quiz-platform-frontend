import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizDetails, startQuizAttempt } from '../../services/studentQuizService';

const QuizDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingQuiz, setStartingQuiz] = useState(false);

  useEffect(() => {
    loadQuizDetails();
  }, [id]);

  const loadQuizDetails = async () => {
    try {
      setLoading(true);
      const data = await getQuizDetails(id);
      console.log(data);
      setQuizData(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quiz details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      setStartingQuiz(true);
      const attempt = await startQuizAttempt(id);
      console.log("attempt", attempt);
      console.log("attempt._id", attempt._id);

      navigate(`/student/quiz-session/${attempt._id}`);
    } catch (err) {
      setError(err.message || 'Failed to start quiz');
      setStartingQuiz(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading quiz details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/student/quizzes')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  if (!quizData) {
    return null;
  }

  const { quiz, attempts } = quizData;
  const completedAttempts = attempts.filter(attempt => attempt.isCompleted);
  const hasIncompleteAttempt = attempts.some(attempt => !attempt.isCompleted);
  const hasCompletedQuiz = completedAttempts.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/student/quizzes')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Quizzes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700">Duration</h3>
            <p>{quiz.duration} minutes</p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700">Created by</h3>
            <p>{quiz.creator.name}</p>
          </div>
        </div>
        
        {hasCompletedQuiz ? (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-6">
            <p className="text-blue-700 font-medium">
              You have already completed this quiz.
            </p>
            <p className="text-blue-600 mt-1">
              You can view your results below in the Previous Attempts section.
            </p>
          </div>
        ) : hasIncompleteAttempt ? (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-6">
            <p className="text-yellow-700">
              You have an unfinished attempt for this quiz. You can continue where you left off.
            </p>
          </div>
        ) : null}
        
        {!hasCompletedQuiz ? (
          <button
            onClick={handleStartQuiz}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={startingQuiz}
          >
            {startingQuiz ? 'Starting Quiz...' : hasIncompleteAttempt ? 'Continue Quiz' : 'Start Quiz'}
          </button>
        ) : (
          <button
            onClick={() => navigate(`/student/attempts/${completedAttempts[0]._id}/results`)}
            className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            View Latest Results
          </button>
        )}
      </div>
      
      {/* {completedAttempts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Previous Attempts</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Taken</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {completedAttempts.map((attempt) => {
                  const startTime = new Date(attempt.startTime);
                  const endTime = attempt.endTime ? new Date(attempt.endTime) : new Date();
                  const timeTaken = Math.round((endTime - startTime) / 60000); // minutes
                  
                  return (
                    <tr key={attempt._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {startTime.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attempt.score}/{attempt.maxScore} ({Math.round((attempt.score / attempt.maxScore) * 100)}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {timeTaken} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/student/attempts/${attempt._id}/results`)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View Results
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default QuizDetails;