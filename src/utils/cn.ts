/**
 * 유틸리티 함수: 클래스네임 조합
 * Tailwind CSS의 clsx 라이브러리를 사용한 클래스네임 병합
 */
import { clsx, type ClassValue } from 'clsx';

/**
 * 여러 클래스네임을 안전하게 조합하는 유틸리티 함수
 * 
 * @param inputs - 클래스네임 값들 (문자열, 객체, 배열 등)
 * @returns 조합된 클래스네임 문자열
 * 
 * @example
 * cn('base-class', { 'active': isActive }, 'additional-class')
 * // => 'base-class active additional-class'
 */
export const cn = (...inputs: ClassValue[]): string => {
  return clsx(inputs);
};