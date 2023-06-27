import { useNotification, NotificationType } from "naive-ui";

export function useNotificationHandler() {
  const notification = useNotification();

  function notify(type: NotificationType) {
    if (type === "error") {
      return notification[type]({
        content: "Ошибка при загрузке страницы",
        meta: "попробуйте снова",
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
    if (type === "success") {
      return notification[type]({
        content: "Успешно добавлено",
        // meta: "",
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  }
  return { notify };
}
