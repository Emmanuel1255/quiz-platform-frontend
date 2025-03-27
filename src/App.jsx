import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import HomePage from '../pages/HomePage';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import StudentRegisterForm from '../components/auth/StudentRegisterForm';
import LecturerRegisterForm from '../components/auth/LecturerRegisterForm';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentQuizList from '../pages/student/QuizList';
import QuizDetails from '../pages/student/QuizDetails';
import QuizSession from '../pages/student/QuizSession';
import QuizResults from '../pages/student/QuizResults';

// Lecturer Pages
import LecturerDashboard from '../pages/lecturer/Dashboard';
import QuizList from '../pages/lecturer/QuizList';
import CreateQuiz from '../pages/lecturer/CreateQuiz';
import EditQuiz from '../pages/lecturer/EditQuiz';
import StudentResults from '../pages/lecturer/StudentResults';
import BulkQuestionUpload from '../pages/lecturer/BulkQuestionUpload';
import StudentsList from '../pages/lecturer/StudentsList';

import NotFoundPage from '../pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<StudentRegisterForm />} />
            <Route path="register/lecturer" element={<LecturerRegisterForm />} />
            
            {/* Protected Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="student/dashboard" element={<StudentDashboard />} />
              <Route path="student/quizzes" element={<StudentQuizList />} />
              <Route path="student/quizzes/:id" element={<QuizDetails />} />
              <Route path="student/quiz-session/:attemptId" element={<QuizSession />} />
              <Route path="student/attempts/:attemptId/results" element={<QuizResults />} />
            </Route>
            
            {/* Protected Lecturer Routes */}
            <Route element={<ProtectedRoute allowedRoles={['lecturer']} />}>
              <Route path="lecturer/dashboard" element={<LecturerDashboard />} />
              <Route path="/lecturer/results" element={<StudentResults />} />
              <Route path="lecturer/quizzes" element={<QuizList />} />
              <Route path="lecturer/quizzes/create" element={<CreateQuiz />} />
              <Route path="lecturer/quizzes/:id" element={<EditQuiz />} />
              <Route path="lecturer/quizzes/:id/bulk-upload" element={<BulkQuestionUpload />} />
              <Route path="lecturer/students" element={<StudentsList />} />
              
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;