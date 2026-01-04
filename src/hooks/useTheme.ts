/**
 * 테마 관리 훅
 * 다크모드와 테마 상태 관리
 */
import { useState, useEffect } from 'react';

interface UseThemeReturn {
  /** 다크모드 상태 */
  isDarkMode: boolean;
  /** 테마 토글 함수 */
  toggleTheme: () => void;
  /** 테마 설정 함수 */
  setTheme: (isDark: boolean) => void;
}

/**
 * 테마 관리 훅
 * 다크모드/라이트모드 상태를 관리하고 localStorage에 저장
 * 
 * @returns 테마 상태와 제어 함수들
 * 
 * @example
 * const { isDarkMode, toggleTheme } = useTheme();
 * 
 * // JSX에서 사용
 * <button onClick={toggleTheme}>
 *   {isDarkMode ? '라이트 모드' : '다크 모드'}
 * </button>
 */
export const useTheme = (): UseThemeReturn => {
  // localStorage에서 초기 테마 상태 가져오기
  const getInitialTheme = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    
    // 저장된 테마가 없으면 시스템 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme);

  /**
   * 테마 토글 함수
   */
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setTheme(newTheme);
  };

  /**
   * 테마 설정 함수
   */
  const setTheme = (isDark: boolean) => {
    setIsDarkMode(isDark);
    
    // localStorage에 테마 상태 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }
  };

  // DOM에 다크모드 클래스 적용
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [isDarkMode]);

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      // 사용자가 수동으로 테마를 설정하지 않은 경우에만 시스템 테마 따르기
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  return {
    isDarkMode,
    toggleTheme,
    setTheme,
  };
};