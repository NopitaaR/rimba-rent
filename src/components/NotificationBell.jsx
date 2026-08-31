/**
 * NotificationBell.jsx
 * Komponen reusable — icon lonceng + badge + popup notifikasi.
 * Bisa dipakai di navbar manapun.
 */
import { useRef, useEffect, useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';
import './NotificationBell.css';

// ── Icons ────────────────────────────────────────────────
const IconBell = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Helpers ──────────────────────────────────────────────
function relativeTime(ts) {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60)  return 'Baru saja';
  const m = Math.floor(s / 60);
  if (m < 60)  return `${m} menit yang lalu`;
  const h = Math.floor(m / 60);
  if (h < 24)  return `${h} jam yang lalu`;
  const d = Math.floor(h / 24);
  return `${d} hari yang lalu`;
}

const TYPE_META = {
  success: { emoji: '✓', label: 'Berhasil', color: 'notif-success' },
  warning: { emoji: '⏳', label: 'Peringatan', color: 'notif-warning' },
  error:   { emoji: '✕', label: 'Gagal',    color: 'notif-error'   },
  info:    { emoji: 'ℹ', label: 'Info',     color: 'notif-info'    },
};

// ── Main Component ───────────────────────────────────────
function NotificationBell({ isOpen, onToggle }) {
  const { notifs, markRead, markAllRead, removeNotif, clearAll, unreadCount } = useNotification();
  const wrapRef = useRef(null);

  // Tutup saat klik di luar
  const handleOutsideClick = useCallback((e) => {
    if (wrapRef.current && !wrapRef.current.contains(e.target)) {
      onToggle(false);
    }
  }, [onToggle]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, handleOutsideClick]);

  // Saat popup dibuka, tandai semua sebagai dibaca setelah 1,5 detik
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(markAllRead, 1500);
    return () => clearTimeout(t);
  }, [isOpen, markAllRead]);

  const handleToggle = () => onToggle(!isOpen);

  const handleNotifClick = (id) => markRead(id);

  return (
    <div className="notif-wrap" ref={wrapRef}>
      {/* ── Bell Button ── */}
      <button
        className={`notif-bell-btn${isOpen ? ' active' : ''}`}
        onClick={handleToggle}
        aria-label="Notifikasi"
        aria-expanded={isOpen}
        id="notif-bell-btn"
      >
        <IconBell />
        {unreadCount > 0 && (
          <span className="notif-badge" aria-label={`${unreadCount} notifikasi baru`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ── Popup ── */}
      <div className={`notif-popup${isOpen ? ' open' : ''}`} role="dialog" aria-label="Notifikasi">
        {/* Header */}
        <div className="notif-header">
          <span className="notif-header-title">NOTIFIKASI</span>
          {notifs.length > 0 && (
            <button className="notif-clear-btn" onClick={clearAll} id="notif-clear-all">
              Hapus Semua
            </button>
          )}
        </div>

        {/* List */}
        <div className="notif-list">
          {notifs.length === 0 ? (
            <div className="notif-empty">
              <span className="notif-empty-icon">🔔</span>
              <p>Belum ada notifikasi</p>
            </div>
          ) : (
            notifs.map((n) => {
              const meta = TYPE_META[n.type] ?? TYPE_META.info;
              return (
                <div
                  key={n.id}
                  className={`notif-item ${meta.color}${n.read ? ' read' : ''}`}
                  onClick={() => handleNotifClick(n.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleNotifClick(n.id)}
                >
                  <div className="notif-item-left">
                    <span className="notif-item-emoji">{meta.emoji}</span>
                  </div>
                  <div className="notif-item-body">
                    <p className="notif-item-title">{n.title}</p>
                    <p className="notif-item-text">{n.body}</p>
                    <span className="notif-item-time">{relativeTime(n.createdAt)}</span>
                  </div>
                  <button
                    className="notif-item-close"
                    onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
                    aria-label="Hapus notifikasi"
                  >
                    <IconX />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationBell;
