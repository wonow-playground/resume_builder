/**
 * 로컬 스토리지 유틸리티
 */

/**
 * 로컬 스토리지에 데이터 저장
 */
export const storage = {
  /**
   * 데이터 저장
   */
  set: <T>(key: string, value: T): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  /**
   * 데이터 가져오기
   */
  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue || null;
      }
    } catch (error) {
      console.error('Failed to get from localStorage:', error);
    }
    return defaultValue || null;
  },

  /**
   * 데이터 삭제
   */
  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },

  /**
   * 모든 데이터 삭제
   */
  clear: (): void => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  },
};