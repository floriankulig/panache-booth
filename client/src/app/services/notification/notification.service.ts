import { Injectable, signal, WritableSignal } from "@angular/core";

type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  message: string;
  duration?: number;
  type?: NotificationType;
  icon?: string;
  id: number;
}

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  public notifications: WritableSignal<Notification[]> = signal([]);

  constructor() {}

  public addNotification(notification: Omit<Notification, "id">) {
    const newNotification = {
      ...notification,
      type: notification.type || "info",
      id: Date.now(),
    };
    this.notifications.update((notifications) => [
      ...notifications,
      newNotification,
    ]);

    if ((newNotification.duration || 0) >= 1000) {
      setTimeout(() => {
        this.removeNotification(newNotification);
      }, newNotification.duration);
    }
  }

  public removeNotification(notification: Notification | number) {
    const index =
      typeof notification === "number"
        ? notification
        : this.notifications().indexOf(notification);

    if (index !== -1) {
      this.notifications.update((notifications) =>
        notifications.filter((_, i) => i !== index),
      );
    }
  }
}
