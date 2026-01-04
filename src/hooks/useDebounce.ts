/**
 * 디바운스 훅
 * 값 변경을 지연시켜 성능 최적화
 */
import { useState, useEffect } from 'react';

/**
 * 디바운스 훅
 * 
 * @param value - 디바운스할 값
 * @param delay - 지연 시간 (ms)
 * @returns 디바운스된 값
 * 
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};