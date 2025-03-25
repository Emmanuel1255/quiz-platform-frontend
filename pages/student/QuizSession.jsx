import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getQuizDetails, 
  saveAnswer, 
  submitQuizAttempt,
  registerTimeAway,
  getQuizAttemptById
} from '../../services/studentQuizService';
import QuizTimer from '../../components/quiz/QuizTimer';
import QuizNavigation from '../../components/quiz/QuizNavigation';
import QuizQuestion from '../../components/quiz/QuizQuestion';

const QuizSession = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  
  const [attempt, setAttempt] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  
  // Refs for visibility tracking
  const visibilityTimeoutRef = useRef(null);
  const documentHiddenStartTime = useRef(null);

  // Load quiz attempt data
  useEffect(() => {
    const fetchAttemptData = async () => {
      try {
        setLoading(true);
        const attemptData = await getQuizAttemptById(attemptId);
        console.log(attemptData);
        setAttempt(attemptData);
        
        // Initialize answers object
        const initialAnswers = {};
        attemptData.quiz.questions.forEach(question => {
          initialAnswers[question._id] = [];
        });
        
        // Populate with existing answers if any
        attemptData.answers.forEach(answer => {
          initialAnswers[answer.questionId] = answer.selectedOptions;
        });
        
        setAnswers(initialAnswers);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load quiz attempt');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttemptData();
  }, [attemptId]);

  // Set up visibility change listener
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the page
        documentHiddenStartTime.current = new Date();
        registerTimeAway(attemptId, 'start')
          .catch(err => console.error('Error registering start of away time:', err));
          
        // Set a timeout to check if they've been away too long
        visibilityTimeoutRef.current = setTimeout(() => {
          // After 3 minutes, auto-submit the quiz
          handleSubmitQuiz('away_too_long');
        }, 180000); // 3 minutes in milliseconds
    } else {
      // User returned to the page
      clearTimeout(visibilityTimeoutRef.current);
      
      if (documentHiddenStartTime.current) {
        const timeAway = (new Date() - documentHiddenStartTime.current) / 1000; // in seconds
        
        registerTimeAway(attemptId, 'end')
          .then(response => {
            if (response.autoSubmitted) {
              // Quiz was auto-submitted due to being away too long
              navigate(`/student/attempts/${attemptId}/results`, { 
                state: { 
                  autoSubmitted: true,
                  message: 'Your quiz was automatically submitted because you were away from the quiz for more than 3 minutes.'
                } 
              });
            }
          })
          .catch(err => console.error('Error registering end of away time:', err));
          
        documentHiddenStartTime.current = null;
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    clearTimeout(visibilityTimeoutRef.current);
  };
}, [attemptId, navigate]);

// Handle answer selection
const handleAnswerSelect = async (questionId, selectedOptions) => {
  try {
    // Update local state
    setAnswers({
      ...answers,
      [questionId]: selectedOptions,
    });
    
    // Save to server
    await saveAnswer(attemptId, questionId, selectedOptions);
  } catch (err) {
    console.error('Error saving answer:', err);
    // Optionally display an error to the user
  }
};

// Handle quiz submission
const handleSubmitQuiz = async (reason = 'manual') => {
  try {
    setSubmitting(true);
    const result = await submitQuizAttempt(attemptId, reason);
    navigate(`/student/attempts/${attemptId}/results`, { 
      state: { 
        result,
        autoSubmitted: reason !== 'manual',
        message: reason === 'time_expired' 
          ? 'Your quiz was automatically submitted because the time expired.'
          : reason === 'away_too_long'
            ? 'Your quiz was automatically submitted because you were away from the quiz for more than 3 minutes.'
            : undefined
      } 
    });
  } catch (err) {
    setError(err.message || 'Failed to submit quiz');
    setSubmitting(false);
  }
};

// Handle timer expiration
const handleTimerExpire = () => {
  handleSubmitQuiz('time_expired');
};

// Handle navigation between questions
const navigateToQuestion = (index) => {
  setCurrentQuestionIndex(index);
};

if (loading) {
  return <div className="text-center py-10">Loading quiz...</div>;
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

if (!attempt || !attempt.quiz) {
  return null;
}

const { quiz } = attempt;
const questions = quiz.questions || [];
const currentQuestion = questions[currentQuestionIndex] || null;

return (
  <div className="container mx-auto px-4 py-8">
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <QuizTimer 
            duration={quiz.duration} 
            startTime={new Date(attempt.startTime)} 
            onExpire={handleTimerExpire} 
          />
        </div>
        
       
      </div>
      
      {/* Main Content */}
      <div className="md:w-3/4">
        <div className="bg-white rounded-lg shadow-md p-6">
          {currentQuestion ? (
            <QuizQuestion 
              question={currentQuestion} 
              currentIndex={currentQuestionIndex}
              selectedOptions={answers[currentQuestion._id] || []}
              onAnswerSelect={(selectedOptions) => 
                handleAnswerSelect(currentQuestion._id, selectedOptions)
              }
            />
          ) : (
            <p className="text-center py-10">No questions available</p>
          )}
          
          {/* Question Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </button>
            <button
              onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {/* Confirmation Dialog */}
    {showConfirmSubmit && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h3 className="text-xl font-bold mb-4">Submit Quiz</h3>
          <p className="mb-6">Are you sure you want to submit your quiz? This action cannot be undone.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setShowConfirmSubmit(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              onClick={() => handleSubmitQuiz('manual')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Confirm Submit'}
            </button>
          </div>
        </div>
      </div>
    )}

<div className="bg-white rounded-lg shadow-md p-4">
         
          
          <button
            onClick={() => setShowConfirmSubmit(true)}
            className="w-full mt-4 bg-green-500 text-white py-2 rounded hover:bg-green-600"
            disabled={submitting}
          >
            Submit Quiz
          </button>
          <QuizNavigation 
            questions={questions} 
            currentIndex={currentQuestionIndex}
            answers={answers}
            onNavigate={navigateToQuestion}
          />
        </div>
  </div>
);
};

export default QuizSession;