/**
 * 이력서 목록 사이드바 컴포넌트
 * 이력서 목록 표시 및 관리
 */
import React, { useState, useCallback } from 'react';
import { ResumeMeta } from '@/types/resume-meta';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Modal } from '@/components/ui';
import { LoadingSpinner } from '@/components/ui';
import { Plus, Clock, FileText, Trash2, Search } from 'lucide-react';
import { clsx } from 'clsx';
import { useDebounce } from '@/hooks';
import { notify } from '@/utils/notify';

interface ResumeListSidebarProps {
  /** 현재 선택된 이력서 ID */
  currentId?: string;
  /** 이력서 선택 핸들러 */
  onSelect: (id: string) => void;
  /** 이력서 삭제 핸들러 */
  onDelete?: (id: string) => void;
  /** 이력서 목록 */
  resumes: ResumeMeta[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 이력서 생성 핸들러 */
  onCreateResume: (title: string) => Promise<void>;
  /** 이력서 삭제 핸들러 */
  onDeleteResume: (id: string) => Promise<void>;
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 이력서 목록 사이드바 컴포넌트
 * 
 * @example
 * <ResumeListSidebar
 *   resumes={resumes}
 *   currentId={currentId}
 *   onSelect={handleSelectResume}
 *   onCreateResume={handleCreateResume}
 *   onDeleteResume={handleDeleteResume}
 *   loading={loading}
 * />
 */
export const ResumeListSidebar: React.FC<ResumeListSidebarProps> = ({
  currentId,
  onSelect,
  resumes,
  loading = false,
  onCreateResume,
  onDeleteResume,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState('새 이력서');

  // 검색어 디바운스
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 검색된 이력서 목록
  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  // 날짜 포맷 함수
  const formatDate = useCallback((isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }, []);

  // 이력서 생성 핸들러
  const handleCreateResume = useCallback(async () => {
    if (!createTitle.trim()) {
      notify.error('이력서 제목을 입력하세요.');
      return;
    }

    try {
      await onCreateResume(createTitle);
      setShowCreateModal(false);
      setCreateTitle('새 이력서');
    } catch (error) {
      console.error('Failed to create resume:', error);
    }
  }, [createTitle, onCreateResume]);

  // 이력서 삭제 핸들러
  const handleDeleteResume = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    notify.confirm('정말로 이 이력서를 삭제하시겠습니까?', async () => {
      try {
        await onDeleteResume(id);
        notify.success('이력서가 삭제되었습니다.');
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    });
  }, [onDeleteResume]);

  return (
    <aside className={clsx(
      'w-80 bg-[var(--bg-card)] border-r border-[var(--border)] flex flex-col h-screen',
      'no-print',
      className
    )}>
      {/* 헤더 */}
      <header className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[var(--text-title)]">
            내 이력서
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
            title="새 이력서 만들기"
            iconLeft={<Plus size={16} />}
          >
            새 이력서
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" size={16} />
          <Input
            placeholder="이력서 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      {/* 목록 */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner size="lg" label="이력서 목록 불러오는 중..." />
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="text-[var(--text-tertiary)] mb-4" size={48} />
            <p className="text-[var(--text-secondary)] mb-4">
              {searchQuery ? '검색 결과가 없습니다.' : '저장된 이력서가 없습니다.'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                iconLeft={<Plus size={16} />}
              >
                첫 이력서 만들기
              </Button>
            )}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredResumes.map((resume) => (
              <ResumeListItem
                key={resume.id}
                resume={resume}
                isActive={currentId === resume.id}
                onClick={() => onSelect(resume.id)}
                onDelete={(e) => handleDeleteResume(e, resume.id)}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      {/* 생성 모달 */}
      <Modal
        isOpen={showCreateModal}
        title="새 이력서 만들기"
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreateResume}
        confirmText="생성"
        cancelText="취소"
        confirmLoading={false}
        showCancel={true}
        confirmDisabled={!createTitle.trim()}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              이력서 제목
            </label>
            <Input
              placeholder="이력서 제목을 입력하세요"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </Modal>
    </aside>
  );
};

/**
 * 이력서 목록 아이템 컴포넌트
 */
interface ResumeListItemProps {
  resume: ResumeMeta;
  isActive: boolean;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  formatDate: (date?: string) => string;
}

const ResumeListItem: React.FC<ResumeListItemProps> = ({
  resume,
  isActive,
  onClick,
  onDelete,
  formatDate
}) => {
  return (
    <div
      className={clsx(
        'p-3 rounded-lg cursor-pointer transition-all duration-200 group',
        'hover:bg-[var(--accent-light)]',
        isActive && 'bg-[var(--accent-light)] border border-[var(--accent)]'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className={clsx(
            'font-medium truncate mb-1',
            isActive ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'
          )}>
            {resume.title || '제목 없음'}
          </h3>
          <div className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
            <Clock size={12} />
            <span>{formatDate(resume.updatedAt)}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          title="삭제"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
};