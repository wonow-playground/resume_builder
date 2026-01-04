/**
 * Resume 컴포넌트
 * 이력서 프리뷰 렌더링
 */
import React from "react";
import Image from "next/image";
import { ResumeConfig } from "@/types/resume";
import { ContactIcon } from "@/components/resume/ContactIcon";
import { SectionHeader } from "@/components/resume/SectionHeader";
import { ResumeItem } from "@/components/resume/ResumeItem";
import { clsx } from "clsx";

interface ResumeProps {
  /** 이력서 데이터 */
  data: ResumeConfig;
  /** 커스텀 클래스네임 */
  className?: string;
}

/**
 * 이력서 컴포넌트
 *
 * @example
 * <Resume data={resumeData} />
 */
export const Resume: React.FC<ResumeProps> = ({ data, className }) => {
  const { profile, sections } = data;

  return (
    <article
      className={clsx(
        "bg-white text-gray-900 p-8 shadow-sm min-h-[297mm]",
        "print:shadow-none print:p-0",
        className
      )}
    >
      {/* 프로필 섹션 */}
      <header
        className="mb-8 pb-6 border-b border-gray-200"
        style={{
          fontSize: "var(--sz-text)",
          lineHeight: "var(--line-height)",
        }}
      >
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h1
              className="font-bold mb-2 text-gray-900"
              style={{ fontSize: "var(--sz-header)" }}
            >
              {profile.name}
            </h1>

            {profile.role && (
              <div
                className="text-gray-600 mb-3"
                style={{ fontSize: "var(--sz-subtitle)" }}
              >
                {profile.role}
              </div>
            )}

            {profile.intro && (
              <div
                className="text-gray-700 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: profile.intro.replace(
                    /\*\*(.*?)\*\*/g,
                    "<strong>$1</strong>"
                  ),
                }}
              />
            )}

            {/* 연락처 정보 */}
            <div className="flex flex-wrap gap-4">
              {Object.entries(profile.contact).map(([type, value]) => {
                if (!value) return null;

                // URL 처리
                let href = value;
                if (type === "email") {
                  href = `mailto:${value}`;
                } else if (!value.startsWith("http")) {
                  href = `https://${value}`;
                }

                return (
                  <a
                    key={type}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    style={{ fontSize: "var(--sz-text)" }}
                  >
                    <ContactIcon type={type} size="sm" />
                    <span>{value}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* 프로필 이미지 */}
          {profile.image && profile.image.trim() !== "" && (
            <Image
              src={profile.image}
              alt={profile.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              width={80}
              height={80}
            />
          )}
        </div>
      </header>

      {/* 섹션들 */}
      {sections
        .filter((section) => section.visible !== false)
        .map((section) => (
          <section
            key={section.id}
            className="mb-8"
            style={{
              fontSize: "var(--sz-text)",
              lineHeight: "var(--line-height)",
              marginBottom: "calc(2rem * var(--scale-section))",
            }}
          >
            <SectionHeader title={section.title} />

            <div className="space-y-4">
              {section.items.map((item) => (
                <ResumeItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}

      {/* 빈 상태 */}
      {sections.filter((section) => section.visible !== false).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            표시할 섹션이 없습니다. 에디터에서 섹션을 추가하세요.
          </p>
        </div>
      )}
    </article>
  );
};
