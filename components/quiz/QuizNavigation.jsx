const QuizNavigation = ({ questions, currentIndex, answers, onNavigate }) => {
    // Check if a question has been answered
    const isAnswered = (questionId) => {
      return answers[questionId] && answers[questionId].length > 0;
    };
    
    return (
      <div>
        <h3 className="text-lg font-medium mb-3">Questions</h3>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => (
            <button
              key={question._id}
              onClick={() => onNavigate(index)}
              className={`w-full h-10 rounded-md flex items-center justify-center 
                ${currentIndex === index ? 'ring-2 ring-blue-500 ' : ''}
                ${isAnswered(question._id) 
                  ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                  : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              aria-label={`Go to question ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <div className="flex items-center mb-2">
            <span className="w-4 h-4 inline-block mr-2 bg-blue-100 border border-blue-300 rounded"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 inline-block mr-2 bg-gray-100 border border-gray-300 rounded"></span>
            <span>Unanswered</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default QuizNavigation;