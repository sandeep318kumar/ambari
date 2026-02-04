/* eslint-disable @typescript-eslint/ban-types */
import { useEffect, useRef, useCallback, useState } from 'react';

function usePolling(apiFunction: Function, interval = 2000) {
  const savedCallback = useRef<Function>();
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const stopPolling = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const pausePolling = useCallback(() => {
    setIsPaused(true);
    stopPolling();
  }, [stopPolling]);

  const resumePolling = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = apiFunction;
  }, [apiFunction]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    
    if (!isPaused && interval !== null) {
      intervalId.current = setInterval(tick, interval);
      return () => stopPolling();
    }
  }, [interval, isPaused, stopPolling]);

  return { stopPolling, pausePolling, resumePolling, isPaused };
}

export default usePolling;