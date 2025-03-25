import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getAttemptResults } from '../../services/studentQuizService';

const QuizResults = () => {
  const { attemptId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get auto-submission message if it exists
  const autoSubmitted = location.state?.autoSubmitted || false;
  const message = location.state?.message || null;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await getAttemptResults(attemptId);
        setResults(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load quiz results');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [attemptId]);

  if (loading) {
    return <div className="text-center py-10">Loading results...</div>;
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

  if (!results) {
    return null;
  }

  // If scores aren't published yet, show the thank you message
  if (!results.isScorePublished) {
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
        
        {autoSubmitted && message && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {message}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-2">Your quiz has been submitted successfully.</p>
          <p className="text-gray-500 mb-8">Your results will be available once published by your lecturer.</p>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Show full results if scores are published
  const startTime = new Date(results.startTime);
  const endTime = new Date(results.endTime);
  const duration = Math.round((endTime - startTime) / 60000); // in minutes
  const percentageScore = Math.round((results.score / results.maxScore) * 100);

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
      
      {autoSubmitted && message && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
        <h2 className="text-xl text-gray-600 mb-6">{results.quiz.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700 mb-1">Score</h3>
            <p className="text-2xl font-bold">
              {results.score}/{results.maxScore} ({percentageScore}%)
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="font-medium text-gray-700 mb-1">Time Taken</h3>
            <p className="text-2xl font-bold">{duration} minutes</p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                percentageScore >= 70 ? 'bg-green-500' : 
                percentageScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentageScore}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600 flex justify-between">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Question Breakdown</h2>
        
        {results.answers.map((answer, index) => {
          const question = answer.questionId;
          const selectedOptions = answer.selectedOptions.map(id => id.toString());
          const correctOptions = question.options.filter(o => o.isCorrect).map(o => o._id.toString());
          
          // Determine if answer is correct
          let isCorrect = false;
          if (question.questionType === 'multiple-choice') {
            isCorrect = selectedOptions.length === correctOptions.length &&
                       selectedOptions.every(id => correctOptions.includes(id));
          } else if (question.questionType === 'true-false') {
            isCorrect = selectedOptions.length === 1 && correctOptions.includes(selectedOptions[0]);
          }
          
          return (
            <div key={question._id} className="border border-gray-200 rounded-md mb-4 overflow-hidden">
              <div className={`p-4 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex justify-between">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    isCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="mt-2">{question.questionText}</p>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <h4 className="font-medium mb-2">Your Answer:</h4>
                <ul className="space-y-2">
                  {question.options.map(option => {
                    const isSelected = selectedOptions.includes(option._id.toString());
                    const isCorrectOption = option.isCorrect;
                    
                    let className = 'flex items-center p-2 rounded';
                    if (isSelected && isCorrectOption) {
                      className += ' bg-green-100';
                    } else if (isSelected && !isCorrectOption) {
                      className += ' bg-red-100';
                    } else if (!isSelected && isCorrectOption) {
                      className += ' bg-yellow-50';
                    }
                    
                    return (
                      <li key={option._id} className={className}>
                        <span className={`inline-block w-5 h-5 rounded-full mr-2 ${
                          isSelected ? 'bg-blue-500' : 'bg-gray-200'
                        }`}></span>
                        <span>{option.text}</span>
                        {!isSelected && isCorrectOption && (
                          <span className="ml-2 text-sm text-green-600">(Correct answer)</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizResults;