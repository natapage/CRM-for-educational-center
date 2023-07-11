import { useNotification, NotificationType } from "naive-ui";

export function useNotificationHandler() {
  const toCreateNotification = useNotification();

  function notify(type: NotificationType) {
    if (type === "error") {
      return toCreateNotification[type]({
        content: "Ошибка при загрузке страницы",
        meta: "попробуйте снова",
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
    if (type === "success") {
      return toCreateNotification[type]({
        content: "Успешно добавлено",
        // meta: "",
        duration: 2500,
        keepAliveOnHover: true,
      });
    }
  }
  return { notify, toCreateNotification };
}
