import React, { useEffect, useState } from 'react';
import { Plus, Clock, FileText, Trash2 } from 'lucide-react';
import styles from './ResumeListSidebar.module.css';
import { ResumeConfig } from '@/types/resume';
import { notify } from '@/utils/notify';
import { InputModal } from './InputModal';

interface ResumeListSidebarProps {
  currentId?: string;
  onSelect: (id: string) => void;
  onDelete?: (id: string) => void;
  refreshTrigger?: number; // Prop to trigger refresh
}

interface ResumeMeta {
  id: string;
  title: string;
  updatedAt: string;
}

export const ResumeListSidebar: React.FC<ResumeListSidebarProps> = ({ currentId, onSelect, onDelete, refreshTrigger }) => {
  const [resumes, setResumes] = useState<ResumeMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/resumes');
      const data = await res.json();
      setResumes(data);
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [refreshTrigger]);

  // Auto-select first resume if none selected
  useEffect(() => {
    if (!currentId && resumes.length > 0) {
      onSelect(resumes[0].id);
    }
  }, [resumes, currentId, onSelect]);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const createResume = async (title: string) => {
    setShowCreateModal(false);

    try {
      const newResume = {
        title,
        profile: {
          name: "홍길동",
          role: "개발자",
          intro: "",
          contact: { email: "", phone: "" }
        },
        sections: [
          { id: "exp", type: "experience", title: "Experience", items: [], visible: true },
          { id: "proj", type: "project", title: "Projects", items: [], visible: true },
          { id: "edu", type: "education", title: "Education", items: [], visible: true },
          { id: "act", type: "activity", title: "Activities", items: [], visible: true }
        ],
        styles: { theme: {
            global: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            profile: { headerSize: 2.75, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            experience: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            project: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            education: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
            activity: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 }
        } }
      };

      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResume),
      });
      const data = await res.json();
      fetchResumes();
      onSelect(data.id);
      notify.success('이력서 생성 완료', `"${title}" 생성되었습니다.`);
    } catch (err) {
      notify.error('이력서 생성 실패', '다시 시도해주세요.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();

    notify.confirm('정말로 이 이력서를 삭제하시겠습니까?', async () => {
      try {
        await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
        fetchResumes();
        if (onDelete) onDelete(id);
        notify.success('이력서 삭제 완료');
      } catch (err) {
        notify.error('이력서 삭제 실패', '다시 시도해주세요.');
      }
    });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`${styles.sidebar} no-print`}>
      <div className={styles.header}>
        <h2 className={styles.title}>내 이력서</h2>
        <button onClick={handleCreate} className={styles.addBtn} title="새 이력서 만들기">
          <Plus size={16} />
        </button>
      </div>
      
      <div className={styles.list}>
        {resumes.map(resume => (
          <div 
            key={resume.id} 
            className={`${styles.item} ${currentId === resume.id ? styles.itemActive : ''}`}
            onClick={() => onSelect(resume.id)}
          >
            <div className={styles.itemTitle}>{resume.title || '제목 없음'}</div>
            <div className={styles.itemMeta}>
              <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
              {formatDate(resume.updatedAt)}
            </div>
            
            <button 
              className={styles.deleteBtn} 
              onClick={(e) => handleDelete(e, resume.id)}
              title="삭제"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {resumes.length === 0 && !loading && (
          <div style={{ padding: '1rem', color: '#9ca3af', textAlign: 'center' }}>
            저장된 이력서가 없습니다.
          </div>
        )}
      </div>

      <InputModal
        isOpen={showCreateModal}
        title="새 이력서 만들기"
        placeholder="이력서 제목을 입력하세요"
        defaultValue="새 이력서"
        onConfirm={createResume}
        onCancel={() => setShowCreateModal(false)}
      />
    </div>
  );
};
