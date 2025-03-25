import { useState } from 'react';
import { addQuestion } from '../../services/questionService';

const AddQuestionForm = ({ quizId, onQuestionAdded }) => {
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
    ],
    points: 1,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleOptionChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newOptions = [...formData.options];
    
    if (name === 'isCorrect') {
      // For true/false questions, ensure only one option is correct
      if (formData.questionType === 'true-false') {
        newOptions.forEach((option, i) => {
          newOptions[i].isCorrect = i === index;
        });
      } else {
        newOptions[index].isCorrect = checked;
      }
    } else {
      newOptions[index].text = value;
    }
    
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const addOption = () => {
    if (formData.questionType === 'true-false') return;
    
    setFormData({
      ...formData,
      options: [...formData.options, { text: '', isCorrect: false }],
    });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2 || formData.questionType === 'true-false') return;
    
    const newOptions = [...formData.options];
    newOptions.splice(index, 1);
    
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const handleQuestionTypeChange = (e) => {
    const questionType = e.target.value;
    
    let options = [...formData.options];
    
    if (questionType === 'true-false') {
      // Set up true/false options
      options = [
        { text: 'True', isCorrect: false },
        { text: 'False', isCorrect: false },
      ];
    } else if (options.length < 2) {
      // Ensure at least 2 options for multiple choice
      options = [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ];
    }
    
    setFormData({
      ...formData,
      questionType,
      options,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.questionText.trim()) {
        setError('Question text is required');
        return;
      }
      
      // For multiple choice, check if at least one option is selected as correct
      if (formData.questionType === 'multiple-choice') {
        const hasCorrectOption = formData.options.some(option => option.isCorrect);
        if (!hasCorrectOption) {
          setError('At least one option must be marked as correct');
          return;
        }
        
        // Ensure all options have text
        const emptyOptions = formData.options.some(option => !option.text.trim());
        if (emptyOptions) {
          setError('All options must have text');
          return;
        }
      }
      
      // For true/false, ensure exactly one option is correct
      if (formData.questionType === 'true-false') {
        const correctCount = formData.options.filter(option => option.isCorrect).length;
        if (correctCount !== 1) {
          setError('Exactly one option must be marked as correct for True/False questions');
          return;
        }
      }
      
      await addQuestion(quizId, formData);
      
      // Reset form
      setFormData({
        questionText: '',
        questionType: 'multiple-choice',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
        points: 1,
      });
      
      // Notify parent component
      onQuestionAdded();
      
    } catch (err) {
      setError(err.message || 'Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
      <h3 className="text-lg font-medium mb-4">Add New Question</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="questionText" className="block text-gray-700 font-medium mb-2">
            Question Text
          </label>
          <textarea
            id="questionText"
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label htmlFor="questionType" className="block text-gray-700 font-medium mb-2">
            Question Type
          </label>
          <select
            id="questionType"
            name="questionType"
            value={formData.questionType}
            onChange={handleQuestionTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="true-false">True/False</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="points" className="block text-gray-700 font-medium mb-2">
            Points
          </label>
          <input
            type="number"
            id="points"
            name="points"
            min="1"
            max="10"
            value={formData.points}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Options
          </label>
          
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type={formData.questionType === 'multiple-choice' ? 'checkbox' : 'radio'}
                name={formData.questionType === 'multiple-choice' ? `isCorrect-${index}` : 'isCorrect'}
                checked={option.isCorrect}
                onChange={(e) => handleOptionChange(index, { target: { name: 'isCorrect', checked: e.target.checked } })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <input
                type="text"
                value={option.text}
                onChange={(e) => handleOptionChange(index, { target: { name: 'text', value: e.target.value } })}
                placeholder={`Option ${index + 1}`}
                className="ml-2 flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly={formData.questionType === 'true-false'}
              />
              {formData.questionType === 'multiple-choice' && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="ml-2 text-red-500"
                  disabled={formData.options.length <= 2}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          
          {formData.questionType === 'multiple-choice' && (
            <button
              type="button"
              onClick={addOption}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              + Add another option
            </button>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionForm;