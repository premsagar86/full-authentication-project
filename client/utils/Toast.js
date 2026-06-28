// /* import toast from "react-hot-toast";

// // ✅ Success Notification
// export const notifySuccess = (message) => {
//   toast.success(message, {
//     iconTheme: {
//       primary: "#22c55e",
//       secondary: "white",
//     },
//   });
// };

// // ❌ Error Notification
// export const notifyError = (message) => {
//   toast.error(message, {
//     iconTheme: {
//       primary: "#ef4444",
//       secondary: "white",
//     },
//   });
// };

// // ⏳ Loading Notification
// export const notifyLoading = (message) => {
//   return toast.loading(message);
// };

// // 🔄 Update Loading → Success
// export const updateToSuccess = (id, message) => {
//   toast.success(message, { id });
// };

// // 🔄 Update Loading → Error
// export const updateToError = (id, message) => {
//   toast.error(message, { id });
// }; */
import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl text-white text-sm font-medium shadow-xl ${colors[type]} animate-slide-in`}>
      {type === 'success' && <span>✓</span>}
      {type === 'error' && <span>✕</span>}
      {message}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}
