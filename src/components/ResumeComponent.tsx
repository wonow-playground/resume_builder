import React from "react";
import Image from "next/image";
import styles from "./Resume.module.css";
import { ResumeConfig } from "@/types/resume";
import { ResumeStyle, ThemeCategory } from "@/types/style";
import { ResumeItem } from "./ResumeItem";
import { Mail, Github, BookOpen, Smartphone, Globe } from "lucide-react";

interface ResumeProps {
  data: ResumeConfig;
}

// Helper to generate CSS variables for a specific theme category
const getThemeStyles = (
  allStyles?: ResumeStyle,
  category: ThemeCategory = "global"
) => {
  if (!allStyles || !allStyles.theme) return {};
  const theme = allStyles.theme[category] || allStyles.theme.global;
  return {
    "--sz-header": `${theme.headerSize}rem`,
    "--sz-item-title": `${theme.itemTitleSize}rem`,
    "--sz-subtitle": `${theme.subtitleSize}rem`,
    "--sz-text": `${theme.textSize}rem`,
    "--scale-margin": theme.spacing,
  } as React.CSSProperties;
};

const ContactIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "email":
      return <Mail size={16} />;
    case "github":
      return <Github size={16} />;
    case "blog":
      return <BookOpen size={16} />;
    case "phone":
      return <Smartphone size={16} />;
    default:
      return <Globe size={16} />;
  }
};

export const Resume: React.FC<ResumeProps> = ({ data }) => {
  const { profile, sections } = data;
  const resumeStyles = data.styles;

  return (
    <div className={styles.container}>
      {/* Profile Section with 'profile' theme */}
      <div style={getThemeStyles(resumeStyles, "profile")}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.name}>{profile.name}</h1>
            <div className={styles.role}>{profile.role}</div>

            {profile.intro && (
              <div className={styles.intro}>{profile.intro}</div>
            )}

            <div className={styles.contactList}>
              {Object.entries(profile.contact).map(([key, value]) => {
                if (!value) return null;
                let href = value;
                if (key === "email") href = `mailto:${value}`;
                else if (!value.startsWith("http")) href = `https://${value}`;

                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactItem}
                  >
                    <ContactIcon type={key} />
                    <span>{value}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {profile.image && profile.image.trim() !== "" && (
            <Image
              src={profile.image}
              alt={profile.name}
              className={styles.profileImage}
              width={80}
              height={80}
            />
          )}
        </header>
      </div>

      {sections.map((section) => {
        if (section.visible === false) return null;

        // Apply section-specific theme based on section.type
        // Map section types to ThemeCategory if names differ
        return (
          <section
            key={section.id}
            className={styles.section}
            style={getThemeStyles(resumeStyles, section.type as ThemeCategory)}
          >
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <div className={styles.items}>
              {section.items.map((item) => (
                <ResumeItem key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
