/**
 * 데이터 유효성 검사 유틸리티
 */

/**
 * 이메일 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * URL 유효성 검사
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 전화번호 유효성 검사 (한국 기준)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^01[016789]-?\d{3,4}-?\d{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * 필수 필드 검사
 */
export const validateRequired = (value: unknown, fieldName: string): string | null => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName}은(는) 필수 항목입니다.`;
  }
  return null;
};

/**
 * 이력서 데이터 유효성 검사
 */
export const validateResume = (data: unknown): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  const resumeData = data as {
    profile?: {
      name?: string;
      role?: string;
      contact?: {
        email?: string;
        phone?: string;
      };
    };
  };

  if (!resumeData.profile?.name) {
    errors.push('이름은 필수 항목입니다.');
  }

  if (!resumeData.profile?.role) {
    errors.push('직군/역할은 필수 항목입니다.');
  }

  if (resumeData.profile?.contact?.email && !isValidEmail(resumeData.profile.contact.email)) {
    errors.push('이메일 형식이 올바르지 않습니다.');
  }

  if (resumeData.profile?.contact?.phone && !isValidPhoneNumber(resumeData.profile.contact.phone)) {
    errors.push('전화번호 형식이 올바르지 않습니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};