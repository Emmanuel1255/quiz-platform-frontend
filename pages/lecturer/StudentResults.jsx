import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizzes } from '../../services/quizService';
import { getAllAttempts, publishQuizResults } from '../../services/resultsService';

const StudentResults = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [exportFormat, setExportFormat] = useState('csv');
  const [publishing, setPublishing] = useState(false);

  // Load all quizzes when component mounts
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        const quizData = await getQuizzes();
        setQuizzes(quizData);
        if (quizData.length > 0) {
          setSelectedQuiz(quizData[0]._id);
        }
      } catch (err) {
        setError(err.message || 'Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  // Load attempts for selected quiz
  useEffect(() => {
    if (!selectedQuiz) return;

    const loadAttempts = async () => {
      try {
        setLoading(true);
        const attemptsData = await getAllAttempts(selectedQuiz);
        setAttempts(attemptsData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load quiz attempts');
        setAttempts([]);
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
  }, [selectedQuiz]);

  const handleQuizChange = (e) => {
    setSelectedQuiz(e.target.value);
  };

  const handlePublishResults = async () => {
    if (!selectedQuiz) return;

    if (window.confirm('Are you sure you want to publish results for this quiz? This will make scores visible to all students.')) {
      try {
        setPublishing(true);
        await publishQuizResults(selectedQuiz);
        
        // Refresh attempt data after publishing
        const attemptsData = await getAllAttempts(selectedQuiz);
        setAttempts(attemptsData);
        
        alert('Quiz results published successfully!');
      } catch (err) {
        setError(err.message || 'Failed to publish results');
      } finally {
        setPublishing(false);
      }
    }
  };

  const handleExportData = () => {
    if (!attempts.length) {
      alert('No data to export');
      return;
    }

    // Get the selected quiz name
    const quizName = quizzes.find(q => q._id === selectedQuiz)?.title || 'quiz-results';
    
    // Format the data based on the export format
    if (exportFormat === 'csv') {
      // Create CSV content
      const headers = ['Student Name', 'Email', 'Registration Number', 'Submission Time', 'Score', 'Total Points', 'Percentage', 'Published'];
      
      const csvContent = [
        headers.join(','),
        ...attempts.map(attempt => {
          const submissionTime = new Date(attempt.endTime).toLocaleString();
          const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
          
          return [
            `"${attempt.student.name}"`,
            attempt.student.email,
            attempt.student.registrationNumber || 'N/A',
            submissionTime,
            attempt.score,
            attempt.maxScore,
            `${percentage}%`,
            attempt.isScorePublished ? 'Yes' : 'No'
          ].join(',');
        })
      ].join('\n');
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${quizName}-results.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading && quizzes.length === 0) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Results</h1>
        <button
          onClick={() => navigate('/lecturer/dashboard')}
          className="text-blue-500 hover:text-blue-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <label htmlFor="quizSelect" className="block text-gray-700 font-medium mb-2">
              Select Quiz
            </label>
            <select
              id="quizSelect"
              value={selectedQuiz}
              onChange={handleQuizChange}
              className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {quizzes.length === 0 ? (
                <option value="">No quizzes available</option>
              ) : (
                quizzes.map(quiz => (
                  <option key={quiz._id} value={quiz._id}>
                    {quiz.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handlePublishResults}
              disabled={publishing || !selectedQuiz || attempts.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {publishing ? 'Publishing...' : 'Publish Results'}
            </button>
            
            <div className="relative">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="csv">CSV</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <button
              onClick={handleExportData}
              disabled={!selectedQuiz || attempts.length === 0}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Export
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading quiz attempts...</div>
        ) : attempts.length === 0 ? (
          <div className="text-center py-10 text-gray-600">
            No attempts found for this quiz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submission Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.map((attempt) => {
                  const submissionTime = new Date(attempt.endTime).toLocaleString();
                  const percentage = Math.round((attempt.score / attempt.maxScore) * 100);
                  
                  return (
                    <tr key={attempt._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.student.registrationNumber || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submissionTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {attempt.score}/{attempt.maxScore} ({percentage}%)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          attempt.isScorePublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {attempt.isScorePublished ? 'Published' : 'Not Published'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => navigate(`/lecturer/attempts/${attempt._id}`)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentResults;