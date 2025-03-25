import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedQuizzes } from '../../services/studentQuizService';

const StudentQuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getPublishedQuizzes();
      console.log(data);
      setQuizzes(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading quizzes...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Available Quizzes</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">There are no quizzes available right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{quiz.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Duration: {quiz.duration} min</span>
                  <span>By: {quiz.creator.name}</span>
                </div>
                <Link
                  to={`/student/quizzes/${quiz._id}`}
                  className="block w-full text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  View Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuizList;