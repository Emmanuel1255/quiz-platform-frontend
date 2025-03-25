import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizById, updateQuiz, publishQuizResults } from '../../services/quizService';
import QuestionList from '../../components/quiz/QuestionList';
import AddQuestionForm from '../../components/quiz/AddQuestionForm';

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 60,
    isPublished: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [publishingResults, setPublishingResults] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const data = await getQuizById(id);
      setQuiz(data);
      setFormData({
        title: data.title,
        description: data.description,
        duration: data.duration,
        isPublished: data.isPublished,
      });
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Validate form data
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Title and description are required');
        return;
      }

      const updatedQuiz = await updateQuiz(id, formData);
      setQuiz(updatedQuiz);
      alert('Quiz updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionAdded = () => {
    setShowAddQuestion(false);
    loadQuiz(); // Reload quiz to get updated questions
  };

  const handlePublishResults = async () => {
    if (window.confirm('Are you sure you want to publish results for this quiz? This will make scores visible to all students.')) {
      try {
        setPublishingResults(true);
        await publishQuizResults(id);
        alert('Quiz results published successfully!');
      } catch (err) {
        setError(err.message || 'Failed to publish results');
      } finally {
        setPublishingResults(false);
      }
    }
  };

  if (loading && !quiz) {
    return <div className="text-center py-10">Loading quiz...</div>;
  }

  if (error && !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/lecturer/quizzes')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Quiz</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              max="180"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Publish quiz</span>
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/lecturer/quizzes')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handlePublishResults}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={publishingResults}
            >
              {publishingResults ? 'Publishing...' : 'Publish Results'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Questions</h2>
          <div className="flex space-x-3">
            <Link
              to={`/lecturer/quizzes/${id}/bulk-upload`}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
            >
              Bulk Upload
            </Link>
            <button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              {showAddQuestion ? 'Cancel' : 'Add Question'}
            </button>
          </div>
        </div>

        {showAddQuestion && (
          <AddQuestionForm
            quizId={id}
            onQuestionAdded={handleQuestionAdded}
          />
        )}

        {quiz && quiz.questions && quiz.questions.length > 0 ? (
          <QuestionList
            questions={quiz.questions}
            onQuestionDeleted={loadQuiz}
          />
        ) : (
          <p className="text-gray-600 text-center py-4">
            No questions added to this quiz yet. Add some questions to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default EditQuiz;