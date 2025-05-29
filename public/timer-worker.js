// Web Worker for continuous timer
let timerId = null;
let startTime = null;
let duration = 0;

self.onmessage = function(e) {
  const { type, payload } = e.data;
  
  switch (type) {
    case 'START_TIMER':
      startTime = Date.now();
      duration = payload.duration * 1000; // Convert to milliseconds
      
      if (timerId) {
        clearInterval(timerId);
      }
      
      timerId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const remainingSeconds = Math.floor(remaining / 1000);
        
        self.postMessage({
          type: 'TIMER_UPDATE',
          payload: {
            timeLeft: remainingSeconds,
            elapsed: Math.floor(elapsed / 1000)
          }
        });
        
        if (remaining <= 0) {
          clearInterval(timerId);
          timerId = null;
          self.postMessage({
            type: 'TIMER_FINISHED'
          });
        }
      }, 1000);
      break;
      
    case 'STOP_TIMER':
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      break;
      
    case 'GET_TIME':
      if (startTime) {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, duration - elapsed);
        const remainingSeconds = Math.floor(remaining / 1000);
        
        self.postMessage({
          type: 'TIMER_UPDATE',
          payload: {
            timeLeft: remainingSeconds,
            elapsed: Math.floor(elapsed / 1000)
          }
        });
      }
      break;
  }
};
