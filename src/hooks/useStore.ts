import { useState, useEffect, useCallback } from 'react';
import { appStore } from '../data/store';

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = appStore.subscribe(() => setTick(t => t + 1));
    return unsub;
  }, []);

  return appStore;
}

export function useNotification() {
  const [message, setMessage] = useState<string | null>(null);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  }, []);

  return { message, show };
}
