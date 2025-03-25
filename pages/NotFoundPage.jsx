import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-8">The page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
        Go Home
      </Link>
    </div>
  );
};

export default NotFoundPage;