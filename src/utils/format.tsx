import React from 'react';

/**
 * Formats text with markdown-like syntax.
 * Currently supports:
 * - **bold**
 */
export const formatText = (text: string, boldClassName?: string): React.ReactNode => {
  if (!text) return null;
  
  // Split by markdown bold syntax
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className={boldClassName}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
