
'use client';

import React, { useState, useEffect } from 'react';
import { Resume } from '@/components/Resume';
import { ResumeConfig } from '@/types/resume';
import { EditorSidebar } from '@/components/EditorSidebar';
import { ResumeListSidebar } from '@/components/ResumeListSidebar';
import { defaultStyles, defaultTheme, ResumeStyle } from '@/types/style';
import { Printer } from 'lucide-react';
import { notify } from '@/utils/notify';

export default function Home() {
  const [data, setData] = useState<ResumeConfig | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastSavedData, setLastSavedData] = useState<string>(''); // Serialized JSON of last saved state

  useEffect(() => {
    setMounted(true);
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch resume data when currentId changes
  useEffect(() => {
    if (!currentId) return;

    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/resumes/${currentId}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const resumeData = await res.json();
        setData(resumeData);
        setLastSavedData(JSON.stringify(resumeData));
      } catch (err) {
        console.error(err);
        notify.error('이력서를 불러오는데 실패했습니다.');
      }
    };
    fetchResume();
  }, [currentId]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSave = async (resumeToSave: any = data) => {
    // Safety check: if resumeToSave is an Event or lacks content, fallback to data
    const actualData = (resumeToSave && typeof resumeToSave === 'object' && 'profile' in resumeToSave) 
      ? resumeToSave 
      : data;

    if (!currentId || !actualData) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/resumes/${currentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualData),
      });
      if (!res.ok) throw new Error('Failed to save');
      setLastSavedData(JSON.stringify(actualData));
      // Trigger list refresh to update "Updated At" time
      setRefreshTrigger(prev => prev + 1);
      notify.success('저장되었습니다!');
    } catch (e) {
      console.error(e);
      notify.error('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectResume = async (id: string) => {
    if (currentId === id) return;

    const isDirty = data && JSON.stringify(data) !== lastSavedData;
    if (isDirty) {
      notify.confirm('수정된 내용이 있습니다. 저장하고 이동하시겠습니까?', async () => {
        await handleSave(data);
        setCurrentId(id);
      });
      // Important to return here if we want to wait for confirm
      return;
    }
    setCurrentId(id);
  };
  
  const handleDeleteResume = (id: string) => {
     if (currentId === id) {
         setCurrentId(null);
         setData(null);
     }
  };

  const styles = data?.styles || defaultStyles;
  const { global } = styles.theme || { global: defaultTheme };
  
  // Construct style variables for the root
  const styleVars = {
    '--sz-header': `${global.headerSize}rem`,
    '--sz-item-title': `${global.itemTitleSize}rem`,
    '--sz-subtitle': `${global.subtitleSize}rem`,
    '--sz-text': `${global.textSize}rem`,
    '--scale-margin': global.spacing,
    
    // Global settings
    '--scale-section': styles.sectionSpacing || 1,
    '--line-height': styles.lineHeight || 1.6,
  } as React.CSSProperties;

  const handleStyleChange = (newStyles: ResumeStyle) => {
    if (data) {
        setData(prev => prev ? ({ ...prev, styles: newStyles }) : null);
    }
  };

  if (!mounted) return null;

  return (
    <div className="main-wrapper">
      <ResumeListSidebar 
        currentId={currentId || undefined} 
        onSelect={handleSelectResume}
        onDelete={handleDeleteResume}
        refreshTrigger={refreshTrigger}
      />

      {data && (
        <EditorSidebar
          data={data}
          onDataChange={(newData) => setData(newData)}
          styles={styles}
          onStyleChange={handleStyleChange}
          onSave={handleSave}
          isSaving={isSaving}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
      )}
      
      <main className="content-wrapper">
        <div className="resume-center">
            {data ? (
                 <div style={styleVars}>
                    <Resume data={data} />
                 </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#6b7280' }}>
                    {currentId ? '불러오는 중...' : '왼쪽 사이드바에서 이력서를 선택하거나 새로 만드세요.'}
                </div>
            )}
        </div>
      </main>

      <button className="print-btn no-print" onClick={() => window.print()} title="Print Resume">
        <Printer size={20} />
      </button>
    </div>
  );
}
