import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: Toast[] = [];
  private toastSubject = new Subject<Toast[]>();
  private counter = 0;

  toastState$ = this.toastSubject.asObservable();

  showError(message: string, duration: number = 5000) {
    const id = this.counter++;
    const toast: Toast = { id, message, type: 'error' };
    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    setTimeout(() => this.removeToast(id), duration);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.toastSubject.next(this.toasts);
  }
}
