import { toast } from 'sonner';

/**
 * Notification interface to allow swapping implementations
 */
export interface NotificationInterface {
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  // For confirmation, we might still use confirm() or implement a custom toast
  confirm: (message: string, onConfirm: () => void) => void;
}

export const notify: NotificationInterface = {
  success: (message, description) => {
    toast.success(message, { description });
  },
  error: (message, description) => {
    toast.error(message, { description });
  },
  info: (message, description) => {
    toast.info(message, { description });
  },
  warning: (message, description) => {
    toast.warning(message, { description });
  },
  confirm: (message, onConfirm) => {
    toast(message, {
      action: {
        label: '확인',
        onClick: onConfirm,
      },
      cancel: {
        label: '취소',
        onClick: () => {}
      }
    });
  }
};
