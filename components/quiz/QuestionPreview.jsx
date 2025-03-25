const QuestionPreview = ({ question, index }) => {
    return (
      <div className="border border-gray-200 rounded-md p-4 mb-4">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">Question {index + 1}</h3>
          <span className="text-sm text-gray-500">{question.points} {question.points === 1 ? 'point' : 'points'}</span>
        </div>
        
        <p className="mb-4">{question.questionText}</p>
        
        <div className="space-y-2">
          {question.options.map((option, optIndex) => (
            <div key={optIndex} className="flex items-center p-2 bg-gray-50 rounded">
              <input
                type={question.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                disabled
                checked={false}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2">{option.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default QuestionPreview;