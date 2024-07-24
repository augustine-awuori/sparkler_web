import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useLocation } from "react-router-dom";

interface Notificaton {
  is_seen: boolean;
}

const useNewNotifications = () => {
  const { client, userData } = useStreamContext();
  const [newNotifications, setNewNotifications] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (!userData || location.pathname === `/notifications`) return;

    let notifFeed = client?.feed("notification", userData?.id);

    async function init() {
      const notifications = await notifFeed?.get();

      const unread = (notifications?.results as Notificaton[]).filter(
        (notification) => !notification.is_seen
      );
      setNewNotifications(unread.length);

      notifFeed?.subscribe((data) => {
        setNewNotifications(newNotifications + data.new.length);
      });
    }

    init();

    return () => notifFeed?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, userData]);

  return { newNotifications };
};

export default useNewNotifications;
