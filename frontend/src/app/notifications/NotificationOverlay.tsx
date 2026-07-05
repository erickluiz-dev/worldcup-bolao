import "./NotificationOverlay.css";
import { useEffect, useState } from "react";

type NotificationType =
  | "success"
  | "warning"
  | "error"
  | "info";

interface NotificationOverlayProps {
  visible: boolean;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  onClose?: () => void;
}

export default function NotificationOverlay({
  visible,
  title,
  message,
  type,
  duration = 5000,
  onClose,
}: NotificationOverlayProps) {

  const [show, setShow] = useState(false);

  useEffect(() => {

    if (!visible) return;

    setShow(true);

    const timer = setTimeout(() => {

      setShow(false);

      if (onClose) {
        setTimeout(onClose, 400);
      }

    }, duration);

    return () => clearTimeout(timer);

  }, [visible, duration, onClose]);

  if (!visible && !show) return null;

  console.log(currentNotification);
  
  return (

    <div className={`notification-backdrop ${show ? "show" : "hide"}`}>

      <div className={`notification-card ${type}`}>

        <h1>{title}</h1>

        <p>{message}</p>

      </div>

    </div>

  );

}