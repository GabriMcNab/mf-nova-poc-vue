import { defineStore } from "pinia";
import type { Icon } from "@/ui-kit/NovaIcon/NovaIcon.vue";

type NotificationTheme = "success" | "warning" | "error" | "info";

export interface Notification {
  id: number;
  type: "toast";
  theme: NotificationTheme;
  timeout: number;
  title: string;
  icon?: Icon;
  message: string;
  visible?: boolean;
}
export interface NotificationStoreState {
  notifications: Notification[];
}

export const useNotifications = defineStore("notifications", {
  state: (): NotificationStoreState => ({ notifications: [] }),
  actions: {
    addNotification(
      notification: Partial<Notification> & Pick<Notification, "message">
    ) {
      const id = Math.floor(Math.random() * 1000);
      const timeout = 4000;
      const theme = notification.theme || "info";
      const icon: Icon = "bell";

      this.notifications.push({
        id,
        type: "toast",
        theme,
        timeout,
        icon,
        title: `notifications.generic.${theme}.title`,
        ...notification,
      });
    },
    deleteNotification(id: Notification["id"]) {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id
      );
    },
    toggleNotification(id: Notification["id"], value: boolean) {
      const item = this.notifications.find(
        (notification) => notification.id === id
      );

      if (item) {
        item.visible = value;
      }
    },
  },
  getters: {
    getToastNotifications: (state) => {
      return state.notifications.filter(({ type }) => type === "toast");
    },
  },
});
