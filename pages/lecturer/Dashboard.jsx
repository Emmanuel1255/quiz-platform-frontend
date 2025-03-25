import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const LecturerDashboard = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lecturer Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {currentUser.name}!</h2>
        <p className="mb-4">
          This is your lecturer dashboard where you can manage quizzes and view student results.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Quiz Management</h3>
            <p className="text-gray-600 mb-4">
              Create and manage quizzes for your students.
            </p>
            <Link
              to="/lecturer/quizzes"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Manage Quizzes
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Student Results</h3>
            <p className="text-gray-600 mb-4">
              View and export student performance data.
            </p>
            <Link
              to="/lecturer/results"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Results
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;