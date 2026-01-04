/**
 * 로컬 스토리지 훅
 * localStorage 데이터 동기화를 위한 커스텀 훅
 */
import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  /** 직렬화 함수 */
  serializer?: {
    stringify: (value: T) => string;
    parse: (value: string) => T;
  };
  /** 기본값 */
  defaultValue: T;
}

interface UseLocalStorageReturn<T> {
  /** 저장된 값 */
  value: T;
  /** 값 설정 함수 */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** 값 삭제 함수 */
  removeValue: () => void;
  /** 로딩 상태 (클라이언트 사이드에서 초기화 완료 여부) */
  isLoading: boolean;
}

/**
 * 로컬 스토리지 훅
 * localStorage와 상태를 동기화하여 영구적인 데이터 저장 제공
 * 
 * @param key - localStorage 키
 * @param options - 훅 옵션
 * @returns 상태와 제어 함수들
 * 
 * @example
 * const { value, setValue, removeValue } = useLocalStorage('user-preferences', {
 *   defaultValue: { theme: 'light', language: 'ko' }
 * });
 * 
 * // 값 업데이트
 * setValue(prev => ({ ...prev, theme: 'dark' }));
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): UseLocalStorageReturn<T> {
  const { defaultValue, serializer = JSON } = options;
  const [isLoading, setIsLoading] = useState(true);

  // 초기값 가져오기
  const getInitialValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? serializer.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  }, [key, defaultValue, serializer]);

  const [storedValue, setStoredValue] = useState<T>(getInitialValue);

  /**
   * 값 설정 함수
   */
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // 함수형 업데이트 지원
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, serializer]);

  /**
   * 값 삭제 함수
   */
  const removeValue = useCallback(() => {
    try {
      setStoredValue(defaultValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // 다른 탭에서의 localStorage 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(serializer.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, serializer]);

  // 초기화 완료 처리
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 0);
    return () => clearTimeout(timer);
  }, []);

  return {
    value: storedValue,
    setValue,
    removeValue,
    isLoading,
  };
}