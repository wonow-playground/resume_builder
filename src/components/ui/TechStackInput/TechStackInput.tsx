/**
 * 기술 스택 입력 컴포넌트
 * 쉼표로 구분된 기술 스택을 입력하는 전용 컴포넌트
 * 글로벌 키보드 이벤트와 분리되어 쉼표/스페이스바 입력 문제 해결
 */
import React from 'react';
import { clsx } from 'clsx';

interface TechStackInputProps {
  /** 기술 스택 배열 값 */
  value?: string[];
  /** 값 변경 핸들러 */
  onChange: (techStack: string[]) => void;
  /** 입력 필드 플레이스홀더 */
  placeholder?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 인라인 스타일 */
  style?: React.CSSProperties;
  /** 전체 너비 */
  fullWidth?: boolean;
}

/**
 * 기술 스택 입력 컴포넌트
 *
 * @example
 * <TechStackInput
 *   value={item.techStack}
 *   onChange={(techStack) => handleSectionItemChange(section.id, item.id, 'techStack', techStack)}
 *   placeholder="Java, Spring Boot, React 등"
 * />
 */
export const TechStackInput: React.FC<TechStackInputProps> = ({
  value,
  onChange,
  placeholder = "Java, Spring Boot, React 등",
  className,
  style,
  fullWidth = false,
}) => {
  // 내부 입력 상태 관리 (사용자가 타이핑 중인 원본 문자열)
  const [inputValue, setInputValue] = React.useState(value?.join(', ') || '');
  const [isFocused, setIsFocused] = React.useState(false);

  // value prop이 변경되면 inputValue 동기화 (단, 포커스 중이 아닐 때만)
  React.useEffect(() => {
    if (!isFocused) {
      const newDisplayValue = value?.join(', ') || '';
      setInputValue(newDisplayValue);
    }
  }, [value, isFocused]);

  /**
   * 입력 변경 핸들러
   * 글로벌 키보드 이벤트와 분리된 독립적인 처리
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력값을 그대로 로컬 상태에 저장 (쉼표, 공백 모두 허용)
    const newValue = e.target.value;
    setInputValue(newValue);

    // 쉼표로 분리하여 배열로 변환
    const techStackArray = newValue
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // 부모 컴포넌트에 배열로 전달
    onChange(techStackArray);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // blur 시점에 값을 정규화 (쉼표 뒤 공백 정리)
    const normalized = value?.join(', ') || '';
    setInputValue(normalized);
  };

  return (
    <input
      type="text"
      className={clsx(
        'border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
        'border-gray-300 focus:ring-blue-500 focus:border-blue-500',
        'px-4 py-2 text-sm',
        fullWidth && 'w-full',
        className
      )}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={style}
      // 모든 키보드 입력을 허용하므로 onKeyDown 핸들러 없이 기본 동작 사용
    />
  );
};