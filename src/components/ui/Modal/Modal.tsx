/**
 * 모달 컴포넌트
 * 재사용 가능한 모달 컴포넌트
 */
import React from 'react';
import { clsx } from 'clsx';
import { Button } from '../Button';

interface ModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 제목 */
  title: string;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 확인 버튼 텍스트 */
  confirmText?: string;
  /** 취소 버튼 텍스트 */
  cancelText?: string;
  /** 확인 버튼 클릭 핸들러 */
  onConfirm?: () => void;
  /** 취소 버튼 표시 여부 */
  showCancel?: boolean;
  /** 확인 버튼 로딩 상태 */
  confirmLoading?: boolean;
  /** 확인 버튼 비활성화 상태 */
  confirmDisabled?: boolean;
  /** 크기 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 재사용 가능한 모달 컴포넌트
 * 
 * @example
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="확인"
 *   onConfirm={handleConfirm}
 * >
 *   정말로 삭제하시겠습니까?
 * </Modal>
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  showCancel = true,
  confirmLoading = false,
  confirmDisabled = false,
  size = 'md',
  className,
}) => {
  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 스크롤 방지
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 사이즈별 클래스네임
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={clsx(
            'relative w-full rounded-lg bg-white shadow-xl transition-all',
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="닫기"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* 모달 내용 */}
          <div className="px-6 py-4">
            {children}
          </div>
          
          {/* 모달 푸터 (버튼들) */}
          {(onConfirm || showCancel) && (
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              {showCancel && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                  disabled={confirmLoading}
                >
                  {cancelText}
                </Button>
              )}
              
              {onConfirm && (
                <Button
                  variant="primary"
                  onClick={onConfirm}
                  loading={confirmLoading}
                  disabled={confirmDisabled}
                >
                  {confirmText}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};