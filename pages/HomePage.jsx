const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to Engineering Quiz Platform</h1>
      <p className="text-lg mb-8">
        An interactive platform for engineering students and lecturers to create, take, and manage quizzes.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">For Students</h2>
          <p>Take quizzes, track your progress, and improve your engineering knowledge.</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">For Lecturers</h2>
          <p>Create quizzes, manage questions, and track student performance.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;