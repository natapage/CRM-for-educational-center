import { useNotification, NotificationType } from "naive-ui";

export function useNotificationHandler() {
  const toCreateNotification = useNotification();

  function notify(type: NotificationType, message: string) {
    if (type === "error") {
      return toCreateNotification[type]({
        content: `${message}`,
        meta: "Попробуйте снова",
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
    if (type === "success") {
      return toCreateNotification[type]({
        content: `${message}`,
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  }
  return { notify };
}
