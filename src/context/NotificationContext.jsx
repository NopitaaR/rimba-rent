/**
 * NotificationContext.jsx
 * Mengelola daftar notifikasi secara global.
 * Notifikasi disimpan di localStorage (bara_notifications).
 */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NotificationContext = createContext(null);

const STORAGE_KEY = 'bara_notifications';

function loadNotifs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveNotifs(notifs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
}

let _nextId = Date.now();
function genId() { return String(++_nextId); }

export function NotificationProvider({ children }) {
  const [notifs, setNotifs] = useState(loadNotifs);

  useEffect(() => {
    saveNotifs(notifs);
  }, [notifs]);

  /** Tambah notifikasi baru */
  const addNotif = useCallback(({ type = 'info', title, body }) => {
    setNotifs((prev) => [
      {
        id: genId(),
        type,       // 'success' | 'warning' | 'info' | 'error'
        title,
        body,
        read: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  /** Tandai satu notifikasi sebagai sudah dibaca */
  const markRead = useCallback((id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  /** Tandai semua sebagai sudah dibaca */
  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  /** Hapus satu notifikasi */
  const removeNotif = useCallback((id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  /** Hapus semua */
  const clearAll = useCallback(() => setNotifs([]), []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifs, addNotif, markRead, markAllRead, removeNotif, clearAll, unreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be inside <NotificationProvider>');
  return ctx;
}
