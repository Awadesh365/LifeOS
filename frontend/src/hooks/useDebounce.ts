import { useState, useEffect, useRef, useCallback } from "react";

interface UseDebounceOptions {
  delay?: number;
  leading?: boolean;
}

/**
 * Debounce a value
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce a callback function
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  options: UseDebounceOptions = {}
): T {
  const { delay = 500, leading = false } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const leadingRef = useRef(true);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (leading && leadingRef.current) {
        leadingRef.current = false;
        callback(...args);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
        leadingRef.current = true;
      }, delay);
    },
    [callback, delay, leading]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}
