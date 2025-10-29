import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'error' | 'success';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toastState$ = this.toastSubject.asObservable();

  private idCounter = 0;

  showToast(message: string, type: ToastType = 'error') {
    const id = this.idCounter++;
    const toast: Toast = { id, message, type };
    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    setTimeout(() => this.removeToast(id), 100000);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next(this.toasts);
  }
}