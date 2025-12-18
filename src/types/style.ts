export interface SectionTheme {
  headerSize: number;     // Name or Section Title
  itemTitleSize: number;  // Role or Job Title
  subtitleSize: number;   // Company/Date
  textSize: number;       // Description/Intro
  spacing: number;        // Gap scale
}

export type ThemeCategory = 'global' | 'profile' | 'experience' | 'project' | 'education' | 'activity';

export interface ResumeStyle {
  theme: Record<ThemeCategory, SectionTheme>;
  lineHeight: number;
  sectionSpacing: number;
}

export const defaultTheme: SectionTheme = {
  headerSize: 1.5,
  itemTitleSize: 1.25,
  subtitleSize: 1,
  textSize: 0.95,
  spacing: 1,
};

export const defaultStyles: ResumeStyle = {
  lineHeight: 1.6,
  sectionSpacing: 1,
  theme: {
    global: { ...defaultTheme },
    profile: {
      headerSize: 2.75,
      itemTitleSize: 1.1,
      subtitleSize: 0.9,
      textSize: 1.0,
      spacing: 1,
    },
    experience: { ...defaultTheme },
    project: { ...defaultTheme },
    education: { ...defaultTheme },
    activity: { ...defaultTheme },
  },
};
