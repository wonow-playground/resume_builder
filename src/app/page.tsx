/**
 * 메인 페이지 컴포넌트
 * 리팩토링된 이력서 애플리케이션 메인
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Resume } from '@/components/resume';
import { ResumeListSidebar } from '@/components/ResumeListSidebar';
import { EditorSidebar } from '@/components/EditorSidebar';
import { Button } from '@/components/ui';
import { Printer } from 'lucide-react';
import { useResume } from '@/hooks';
import { useTheme } from '@/hooks';
import { useKeyboardShortcuts } from '@/hooks';


/**
 * 메인 페이지 컴포넌트
 */
export default function Home() {
  // 훅들
  const {
    data,
    currentId,
    resumes,
    loading,
    isSaving,
    selectResume,
    updateData,
    saveResume,
    createResume,
    deleteResume,
  } = useResume();

  const { isDarkMode, toggleTheme } = useTheme();

  // 키보드 단축키 설정
  useKeyboardShortcuts({
    shortcuts: [
      {
        key: 'ctrl+s',
        callback: () => saveResume().catch(console.error),
        description: '저장',
      },
      {
        key: 'ctrl+p',
        callback: () => window.print(),
        description: '인쇄',
      },
    ],
  });

  // 스타일 변수 생성
  const styleVars = React.useMemo(() => {
    if (!data) return {};

    const styles = data.styles || {
      theme: { global: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 } },
      lineHeight: 1.6,
      sectionSpacing: 1
    };
    const global = styles.theme?.global || {};
    
    return {
      '--sz-header': `${global.headerSize}rem`,
      '--sz-item-title': `${global.itemTitleSize}rem`,
      '--sz-subtitle': `${global.subtitleSize}rem`,
      '--sz-text': `${global.textSize}rem`,
      '--scale-margin': global.spacing,
      '--scale-section': styles.sectionSpacing || 1,
      '--line-height': styles.lineHeight || 1.6,
    } as React.CSSProperties;
  }, [data]);

  // 마운트 상태 - hydration mismatch 방지
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // hydration이 완료된 후에 마운트 상태 업데이트
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="flex min-h-screen">
        {/* 이력서 목록 사이드바 */}
        <ResumeListSidebar
          currentId={currentId || undefined}
          onSelect={selectResume}
          onDelete={deleteResume}
          refreshTrigger={0}
        />

        {/* 메인 컨텐츠 */}
        <main className="flex-1 flex items-center justify-center p-8">
          {data ? (
            <div 
              className="w-full max-w-[var(--container-width)] mx-auto"
              style={styleVars}
            >
              <Resume data={data} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center max-w-md">
              <div className="w-24 h-24 bg-[var(--bg-card)] rounded-full flex items-center justify-center mb-6">
                <Printer className="text-[var(--text-tertiary)]" size={32} />
              </div>
              <h2 className="text-xl font-semibold text-[var(--text-title)] mb-2">
                {loading ? '이력서를 불러오는 중...' : '이력서를 선택하세요'}
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                {loading 
                  ? '잠시만 기다려주세요.'
                  : '왼쪽 사이드바에서 이력서를 선택하거나 새로 만드세요.'
                }
              </p>
              {!loading && !currentId && resumes.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => {
                    const title = '새 이력서';
                    createResume(title).catch(console.error);
                  }}
                >
                  첫 이력서 만들기
                </Button>
              )}
            </div>
          )}
        </main>

        {/* 에디터 사이드바 */}
        {data && (
          <EditorSidebar
            data={data}
            onDataChange={updateData}
            styles={data.styles || {
              theme: {
                global: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
                profile: { headerSize: 2.75, itemTitleSize: 1.1, subtitleSize: 0.9, textSize: 1.0, spacing: 1 },
                experience: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
                project: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
                education: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 },
                activity: { headerSize: 1.5, itemTitleSize: 1.25, subtitleSize: 1, textSize: 0.95, spacing: 1 }
              },
              lineHeight: 1.6,
              sectionSpacing: 1
            }}
            onStyleChange={(newStyles) => updateData({ ...data, styles: newStyles })}
            onSave={saveResume}
            isSaving={isSaving}
            isDarkMode={isDarkMode}
            onThemeToggle={toggleTheme}
          />
        )}
      </div>

      {/* 인쇄 버튼 */}
      {data && (
        <button
          onClick={() => window.print()}
          className="print-btn"
          title="이력서 인쇄 (Ctrl+P)"
        >
          <Printer size={20} />
        </button>
      )}
    </div>
  );
}