export type ToastType = 'error' | 'success';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}