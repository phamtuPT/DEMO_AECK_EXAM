import { useState, useEffect, useRef } from 'react';

const useTimer = (initialDuration = 0) => {
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const workerRef = useRef(null);
  const onFinishRef = useRef(null);

  useEffect(() => {
    // Create Web Worker
    workerRef.current = new Worker('/timer-worker.js');
    
    // Handle messages from worker
    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data;
      
      switch (type) {
        case 'TIMER_UPDATE':
          setTimeLeft(payload.timeLeft);
          break;
          
        case 'TIMER_FINISHED':
          setTimeLeft(0);
          setIsRunning(false);
          if (onFinishRef.current) {
            onFinishRef.current();
          }
          break;
      }
    };

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.postMessage({ type: 'STOP_TIMER' });
        workerRef.current.terminate();
      }
    };
  }, []);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && workerRef.current && isRunning) {
        // When page becomes visible again, get current time
        workerRef.current.postMessage({ type: 'GET_TIME' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  const startTimer = (duration, onFinish) => {
    if (workerRef.current) {
      setTimeLeft(duration);
      setIsRunning(true);
      onFinishRef.current = onFinish;
      
      workerRef.current.postMessage({
        type: 'START_TIMER',
        payload: { duration }
      });
    }
  };

  const stopTimer = () => {
    if (workerRef.current) {
      setIsRunning(false);
      workerRef.current.postMessage({ type: 'STOP_TIMER' });
    }
  };

  const resetTimer = (duration = initialDuration) => {
    stopTimer();
    setTimeLeft(duration);
  };

  return {
    timeLeft,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer
  };
};

export default useTimer;
