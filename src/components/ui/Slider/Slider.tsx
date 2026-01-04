/**
 * 슬라이더 컴포넌트
 * 범위 선택을 위한 재사용 가능한 슬라이더
 */
import React from 'react';
import { clsx } from 'clsx';

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** 라벨 */
  label?: string;
  /** 최소값 */
  min?: number;
  /** 최대값 */
  max?: number;
  /** 단계 */
  step?: number;
  /** 값 표시 포맷 */
  valueFormat?: (value: number) => string;
  /** 단위 */
  unit?: string;
  /** 전체 너비 */
  fullWidth?: boolean;
}

/**
 * 재사용 가능한 슬라이더 컴포넌트
 * 
 * @example
 * <Slider
 *   label="글자 크기"
 *   min={12}
 *   max={24}
 *   step={1}
 *   value={fontSize}
 *   onChange={handleChange}
 *   unit="px"
 * />
 */
export const Slider: React.FC<SliderProps> = ({
  label,
  min = 0,
  max = 100,
  step = 1,
  valueFormat,
  unit,
  fullWidth = false,
  className,
  value,
  ...props
}) => {
  // 고유 ID 생성
  const sliderId = React.useId();

  // 값 포맷팅 함수
  const formatValue = (val: number): string => {
    if (valueFormat) {
      return valueFormat(val);
    }
    return unit ? `${val}${unit}` : `${val}`;
  };

  const currentValue = value as number || 0;
  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={clsx(fullWidth && 'w-full', className)}>
      {label && (
        <label 
          htmlFor={sliderId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          {/* 슬라이더 트랙 */}
          <div className="relative h-2 bg-gray-200 rounded-full">
            {/* 진행 상태 트랙 */}
            <div 
              className="absolute h-full bg-blue-500 rounded-full transition-all duration-150"
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {/* 슬라이더 입력 */}
          <input
            id={sliderId}
            type="range"
            min={min}
            max={max}
            step={step}
            value={currentValue}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            {...props}
          />
          
          {/* 슬라이더 핸들 */}
          <div 
            className="absolute top-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-sm transition-all duration-150 pointer-events-none"
            style={{ 
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
        
        {/* 값 표시 */}
        <div className="min-w-[3rem] text-right">
          <span className="text-sm font-medium text-gray-900">
            {formatValue(currentValue)}
          </span>
        </div>
      </div>
    </div>
  );
};