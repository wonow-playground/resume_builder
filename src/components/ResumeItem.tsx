import React from 'react';
import styles from './Resume.module.css';
import { SectionItem } from '@/types/resume';
import { formatText } from '@/utils/format';
import { ExternalLink } from 'lucide-react';

interface ResumeItemProps {
  item: SectionItem;
}

export const ResumeItem: React.FC<ResumeItemProps> = ({ item }) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader}>
        <div className={styles.meta}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
          {item.subtitle && <span className={styles.itemSubtitle}>{item.subtitle}</span>}
          {item.links && item.links.map((link, i) => (
             <a
               key={i}
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800 ml-2 inline-flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
               title={link.label}
             >
               <ExternalLink size={14} />
             </a>
          ))}
        </div>
        {item.date && <span className={styles.itemDate}>{item.date}</span>}
      </div>

      {item.description && (
        <div className={styles.itemDesc}>
          {formatText(item.description, styles.bold)}
        </div>
      )}

      {item.points && item.points.length > 0 && (
        <ul className={styles.points}>
          {item.points.map((point, idx) => (
            <li key={idx} className={styles.point}>
              {/* Check if point starts with bullet or dash, if not add one? No, CSS list-style?
                  The design in CSS has list-style: none.
                  Maybe I should add a bullet span or marker.
                  The text has newlines.
              */}
              {/* Handle multi-line points if necessary */}
              <div className="flex gap-2">
                 <span style={{ opacity: 0.5 }}>•</span>
                 <span>{formatText(point, styles.bold)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {item.techStack && item.techStack.length > 0 && (
        <div className={styles.techStack}>
          {item.techStack.map((tech, idx) => (
            <span key={idx} className={styles.tag}>
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Render nested subItems if they exist */}
      {item.subItems && item.subItems.length > 0 && (
        <div style={{ marginTop: '1.5rem', marginLeft: '1rem', borderLeft: '2px solid #e5e7eb', paddingLeft: '1rem' }}>
          {item.subItems.map((subItem) => (
            <ResumeItem key={subItem.id} item={subItem} />
          ))}
        </div>
      )}
    </div>
  );
};
