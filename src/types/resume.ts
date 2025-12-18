import { ResumeStyle } from './style';

export interface ResumeConfig {
  id?: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  styles?: ResumeStyle;
  profile: {
    name: string;
    role: string;
    intro: string;
    image?: string; // URL to profile image
    contact: {
      email?: string;
      phone?: string;
      github?: string;
      blog?: string;
    };
  };
  sections: Section[];
}

export type SectionType = 'experience' | 'project' | 'education' | 'activity' | 'custom';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible?: boolean;
  items: SectionItem[];
}

export interface SectionItem {
  id: string;
  title?: string;
  subtitle?: string; // e.g. Company name, Role, or Date
  date?: string;
  description?: string; // Main description text
  techStack?: string[]; // Tags for tech stack
  points?: string[]; // Bullet points
  links?: { label: string; url: string }[];
  location?: string;
  images?: string[]; // For project screenshots if needed
}
