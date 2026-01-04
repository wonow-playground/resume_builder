/**
 * 이력서 데이터 관리 훅
 * 이력서 CRUD 작업과 상태 관리를 처리
 */
import { useState, useCallback, useEffect } from 'react';
import { ResumeConfig } from '@/types/resume';
import { ResumeMeta } from '@/types/resume-meta';
import { notify } from '@/utils/notify';

interface UseResumeOptions {
  /** 초기 이력서 ID */
  initialId?: string;
}

interface UseResumeReturn {
  /** 현재 이력서 데이터 */
  data: ResumeConfig | null;
  /** 현재 이력서 ID */
  currentId: string | null;
  /** 이력서 목록 */
  resumes: ResumeMeta[];
  /** 로딩 상태 */
  loading: boolean;
  /** 저장 중 상태 */
  isSaving: boolean;
  /** 이력서 목록 새로고침 트리거 */
  refreshTrigger: number;
  /** 이력서 선택 핸들러 */
  selectResume: (id: string) => Promise<void>;
  /** 이력서 데이터 업데이트 핸들러 */
  updateData: (newData: ResumeConfig) => void;
  /** 이력서 저장 핸들러 */
  saveResume: () => Promise<void>;
  /** 이력서 목록 새로고침 */
  refreshResumes: () => Promise<void>;
  /** 이력서 생성 핸들러 */
  createResume: (title: string) => Promise<string>;
  /** 이력서 삭제 핸들러 */
  deleteResume: (id: string) => Promise<void>;
}

/**
 * 이력서 데이터 관리 훅
 * 
 * @param options - 훅 옵션
 * @returns 이력서 상태와 핸들러들
 * 
 * @example
 * const {
 *   data,
 *   currentId,
 *   selectResume,
 *   updateData,
 *   saveResume,
 *   isSaving
 * } = useResume({ initialId: 'resume-123' });
 */
export const useResume = (options: UseResumeOptions = {}): UseResumeReturn => {
  const { initialId } = options;
  
  // 상태 관리
  const [data, setData] = useState<ResumeConfig | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(initialId || null);
  const [resumes, setResumes] = useState<ResumeMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 마지막 저장된 데이터 직렬화된 문자열
  const [lastSavedData, setLastSavedData] = useState<string>('');

  /**
   * 이력서 목록 가져오기
   */
  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resumes');
      if (!response.ok) throw new Error('Failed to fetch resumes');
      const resumeList = await response.json();
      setResumes(resumeList);
      
      // 선택된 이력서가 없고 목록에 이력서가 있으면 첫 번째 선택
      if (!currentId && resumeList.length > 0 && !initialId) {
        setCurrentId(resumeList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      notify.error('이력서 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [currentId, initialId]);

  /**
   * 특정 이력서 데이터 가져오기
   */
  const fetchResume = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/resumes/${id}`);
      if (!response.ok) throw new Error('Failed to fetch resume');
      const resumeData = await response.json();
      setData(resumeData);
      setLastSavedData(JSON.stringify(resumeData));
    } catch (error) {
      console.error('Failed to fetch resume:', error);
      notify.error('이력서를 불러오는데 실패했습니다.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 이력서 목록 새로고침
   */
  const refreshResumes = useCallback(async () => {
    await fetchResumes();
    setRefreshTrigger(prev => prev + 1);
  }, [fetchResumes]);

  /**
   * 이력서 선택
   */
  const selectResume = useCallback(async (id: string) => {
    if (currentId === id) return;

    // 수정된 내용이 있는지 확인
    if (data && JSON.stringify(data) !== lastSavedData) {
      let confirmed = false;
      await new Promise<void>((resolve) => {
        notify.confirm(
          '수정된 내용이 있습니다. 저장하고 이동하시겠습니까?',
          () => {
            confirmed = true;
            resolve();
          }
        );
      });
      
      if (!confirmed) {
        return;
      }
      
      if (confirmed) {
        // Call save logic directly to avoid circular dependency
        if (!currentId || !data) return;
        setIsSaving(true);
        try {
          const response = await fetch(`/api/resumes/${currentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) throw new Error('Failed to save resume');
          
          setLastSavedData(JSON.stringify(data));
          await refreshResumes();
          notify.success('저장되었습니다!');
        } catch (error) {
          console.error('Failed to save resume:', error);
          notify.error('저장에 실패했습니다.');
        } finally {
          setIsSaving(false);
        }
      }
    }
    
    setCurrentId(id);
  }, [currentId, data, lastSavedData, refreshResumes]);

  /**
   * 이력서 데이터 업데이트
   */
  const updateData = useCallback((newData: ResumeConfig) => {
    setData(newData);
  }, []);

  /**
   * 이력서 저장
   */
  const saveResume = useCallback(async () => {
    if (!currentId || !data) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/resumes/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to save resume');
      
      setLastSavedData(JSON.stringify(data));
      await refreshResumes(); // 목록 새로고칭 (업데이트 시간 표시)
      notify.success('저장되었습니다!');
    } catch (error) {
      console.error('Failed to save resume:', error);
      notify.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  }, [currentId, data, refreshResumes]);

  /**
   * 새 이력서 생성
   */
  const createResume = useCallback(async (title: string): Promise<string> => {
    try {
      const newResume: Omit<ResumeConfig, 'id'> = {
        title,
        profile: {
          name: '홍길동',
          role: '개발자',
          intro: '',
          contact: { email: '', phone: '', github: '', blog: '' }
        },
        sections: [
          { id: 'exp', type: 'experience', title: 'Experience', items: [], visible: true },
          { id: 'proj', type: 'project', title: 'Projects', items: [], visible: true },
          { id: 'edu', type: 'education', title: 'Education', items: [], visible: true },
          { id: 'act', type: 'activity', title: 'Activities', items: [], visible: true }
        ],
        styles: {
          lineHeight: 1.6,
          sectionSpacing: 1,
          theme: {
            global: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            profile: { headerSize: 2.75, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            experience: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            project: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            education: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            activity: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 }
          }
        }
      };

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResume),
      });
      
      if (!response.ok) throw new Error('Failed to create resume');
      
      const createdResume = await response.json();
      await refreshResumes();
      setCurrentId(createdResume.id);
      notify.success('이력서 생성 완료', `"${title}" 생성되었습니다.`);
      
      return createdResume.id;
    } catch (error) {
      console.error('Failed to create resume:', error);
      notify.error('이력서 생성 실패', '다시 시도해주세요.');
      throw error;
    }
  }, [refreshResumes]);

  /**
   * 이력서 삭제
   */
  const deleteResume = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete resume');
      
      await refreshResumes();
      
      // 삭제된 이력서가 현재 선택된 이력서였으면 초기화
      if (currentId === id) {
        setCurrentId(null);
        setData(null);
      }
      
      notify.success('이력서 삭제 완료');
    } catch (error) {
      console.error('Failed to delete resume:', error);
      notify.error('이력서 삭제 실패', '다시 시도해주세요.');
      throw error;
    }
  }, [currentId, refreshResumes]);

  // 초기 이력서 목록 로드
  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  // 선택된 이력서 ID가 변경되면 해당 데이터 로드
  useEffect(() => {
    if (currentId) {
      fetchResume(currentId);
    }
  }, [currentId, fetchResume]);

  return {
    data,
    currentId,
    resumes,
    loading,
    isSaving,
    refreshTrigger,
    selectResume,
    updateData,
    saveResume,
    refreshResumes,
    createResume,
    deleteResume,
  };
};