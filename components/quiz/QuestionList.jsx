import { useState } from 'react';
import { deleteQuestion } from '../../services/questionService';

const QuestionList = ({ questions, onQuestionDeleted }) => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleQuestion = (id) => {
    if (expandedQuestion === id) {
      setExpandedQuestion(null);
    } else {
      setExpandedQuestion(id);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        setLoading(true);
        await deleteQuestion(id);
        onQuestionDeleted();
      } catch (err) {
        setError(err.message || 'Failed to delete question');
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div key={question._id} className="border border-gray-200 rounded-md overflow-hidden">
          <div 
            className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
            onClick={() => toggleQuestion(question._id)}
          >
            <div className="flex-grow">
              <h4 className="font-medium text-gray-900">{question.questionText}</h4>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="mr-4">{question.questionType === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}</span>
                <span>{question.points} {question.points === 1 ? 'point' : 'points'}</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteQuestion(question._id);
                }}
                className="text-red-500 mr-3"
                disabled={loading}
              >
                Delete
              </button>
              <svg 
                className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedQuestion === question._id ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {expandedQuestion === question._id && (
            <div className="p-4 border-t border-gray-200">
              <h5 className="font-medium text-gray-700 mb-2">Options:</h5>
              <ul className="space-y-2">
                {question.options.map((option, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`inline-block w-5 h-5 rounded-full mr-2 mt-0.5 ${option.isCorrect ? 'bg-green-500' : 'bg-gray-200'}`}></span>
                    <span>{option.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;