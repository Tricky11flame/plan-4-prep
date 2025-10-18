import { useEffect } from 'react';
import type { NotificationState } from '../types';

interface NotificationProps {
  notification: NotificationState | null;
  onClear: () => void;
}

export default function Notification({ notification, onClear }: NotificationProps) {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClear, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClear]);

  if (!notification) return null;

  const colorClasses = {
    error: 'bg-rose-400',
    success: 'bg-blue-400',
    info: 'bg-indigo-500',
  };

  return (
    <div
      className={`fixed top-5 border-[1.5pt] border-black right-5 text-black py-2 px-4 rounded-lg shadow-md transition-all duration-150 z-50 ${colorClasses[notification.type]}`}
    >
      <p>{notification.message}</p>
    </div>
  );
}