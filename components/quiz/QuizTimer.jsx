import { useState, useEffect } from 'react';

const QuizTimer = ({ duration, startTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isAlmostDone, setIsAlmostDone] = useState(false);
  
  function calculateTimeLeft() {
    const now = new Date();
    const start = new Date(startTime);
    const endTime = new Date(start.getTime() + duration * 60000); // duration in minutes to milliseconds
    
    const diff = endTime - now;
    
    if (diff <= 0) {
      return { minutes: 0, seconds: 0 };
    }
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return { minutes, seconds };
  }
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // Check if time is almost up (less than 5 minutes)
      if (newTimeLeft.minutes < 5 && !isAlmostDone) {
        setIsAlmostDone(true);
      }
      
      // Check if time is up
      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [duration, startTime, onExpire, isAlmostDone]);
  
  // Format time display
  const formattedMinutes = String(timeLeft.minutes).padStart(2, '0');
  const formattedSeconds = String(timeLeft.seconds).padStart(2, '0');
  
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium mb-2">Time Remaining</h3>
      <div className={`text-3xl font-bold ${isAlmostDone ? 'text-red-500 animate-pulse' : ''}`}>
        {formattedMinutes}:{formattedSeconds}
      </div>
    </div>
  );
};

export default QuizTimer;