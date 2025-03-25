import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { getPublishedQuizzes } from '../../services/studentQuizService';

const StudentDashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const data = await getPublishedQuizzes();
        // Only show the most recent 3 quizzes
        setRecentQuizzes(data.slice(0, 3));
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser.name}!</h2>
        <p className="text-gray-600 mb-4">
          This is your student dashboard where you can view and take quizzes.
        </p>
        
        <div className="mt-6">
          <Link
            to="/student/quizzes"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Browse All Quizzes
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
          
          {loading ? (
            <p className="text-center py-4">Loading quizzes...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-3 rounded">
              {error}
            </div>
          ) : recentQuizzes.length > 0 ? (
            <div className="space-y-4">
              {recentQuizzes.map(quiz => (
                <div key={quiz._id} className="border border-gray-200 rounded-md p-4">
                  <h3 className="font-medium mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{quiz.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>Duration: {quiz.duration} min</span>
                    <span>By: {quiz.creator.name}</span>
                  </div>
                  <Link
                    to={`/student/quizzes/${quiz._id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Quiz
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-600">No quizzes available yet.</p>
          )}
          
          {recentQuizzes.length > 0 && (
            <div className="mt-4 text-center">
              <Link
                to="/student/quizzes"
                className="text-blue-500 hover:text-blue-700"
              >
                View All Quizzes
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
          
          <p className="text-center py-10 text-gray-600">
            Your quiz history and progress will appear here as you complete quizzes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;