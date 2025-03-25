const QuizQuestion = ({ question, selectedOptions, onAnswerSelect, currentIndex }) => {
    const handleOptionChange = (optionId) => {
      // Always use single selection for all questions (including multiple-choice)
      const newSelectedOptions = [optionId];
      onAnswerSelect(newSelectedOptions);
    };
    
    return (
      <div>
        <h2 className="text-xl font-semibold mb-2">Question {currentIndex + 1}</h2>
        <p className="text-lg mb-6">{question.questionText}</p>
        
        <div className="space-y-3">
          {question.options.map((option) => (
            <label 
              key={option._id}
              className={`flex items-center p-3 rounded-md border cursor-pointer
                ${selectedOptions.includes(option._id) 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
            >
              <input
                type="radio" // Changed to radio button for single selection
                name={`question-${question._id}`}
                value={option._id}
                checked={selectedOptions.includes(option._id)}
                onChange={() => handleOptionChange(option._id)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-3">{option.text}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };
  
  export default QuizQuestion;