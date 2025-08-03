import { useEffect } from "react";

export default function ConfirmationToast({
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
      {message}
    </div>
  );
}
