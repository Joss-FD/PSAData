import { Component, OnInit } from '@angular/core';
import { ToastService, Toast } from './toast.service';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 1 }), // keep text visible
        animate('400ms ease-out', style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState$.subscribe(toasts => {
      this.toasts = [...toasts];
    });
  }

  closeToast(id: number) {
    this.toastService.removeToast(id);
  }
}
