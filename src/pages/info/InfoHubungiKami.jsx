import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './InfoPages.css';

const IconCart = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconInfo = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const IconProfile = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="9" r="3"/>
    <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855"/>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

const IconMessageSquare = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

function InfoHubungiKami() {
  const { totalItems } = useCart();

  return (
    <div className="info-page">
      {/* ── NAVBAR ── */}
      <nav className="info-navbar">
        <div className="info-navbar-inner">
          <Link to="/dashboard" className="info-brand-text">BARA RIMBA RENT</Link>
          <div className="info-navbar-right">
            <Link to="/cart" className="info-icon-btn" aria-label="Keranjang" id="info-nav-cart">
              <IconCart />
              {totalItems > 0 && <span className="dash-cart-badge">{totalItems}</span>}
            </Link>
            <Link to="/information" className="info-icon-btn active" aria-label="Informasi" id="info-nav-info">
              <IconInfo />
            </Link>
            <Link to="/profile" className="info-icon-btn" aria-label="Profil" id="info-nav-profile">
              <IconProfile />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── CONTENT ── */}
      <div className="info-content">
        <Link to="/information" className="info-back-btn" id="info-back-btn">
          <IconArrowLeft />
          <span>Kembali ke Informasi</span>
        </Link>

        <div className="info-detail-header">
          <h1 className="info-detail-title">HUBUNGI KAMI</h1>
          <p className="info-detail-subtitle">
            Tim customer support kami siap melayani pertanyaan, konsultasi sewa, dan konfirmasi transaksi Anda.
          </p>
        </div>

        {/* Two-Column Section */}
        <div className="info-two-col">
          {/* Card 1: Kontak Pelanggan */}
          <div className="info-section-card">
            <span className="info-tag success">RESPON CEPAT</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconMessageSquare /> Saluran Komunikasi
              </h2>
            </div>
            
            <div className="info-contact-list">
              <div className="info-contact-item">
                <div className="info-contact-icon">📱</div>
                <div>
                  <p className="info-contact-label">WhatsApp Admin</p>
                  <p className="info-contact-value">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">✉️</div>
                <div>
                  <p className="info-contact-label">Email Customer Care</p>
                  <p className="info-contact-value">info@bararimbarent.com</p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">📷</div>
                <div>
                  <p className="info-contact-label">Instagram Official</p>
                  <p className="info-contact-value">@bararimba_rent</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="info-whatsapp-btn"
              style={{ marginTop: 'auto', width: '100%', textDecoration: 'none' }}
              id="info-wa-btn"
            >
              <IconWhatsApp />
              <span>Chat Admin via WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Jam Operasional Support */}
          <div className="info-section-card">
            <span className="info-tag info">JAM DUKUNGAN</span>
            <div className="info-section-header">
              <h2 className="info-section-title">
                <IconMessageSquare /> Waktu Layanan Support
              </h2>
            </div>

            <div className="info-contact-list">
              <div className="info-contact-item">
                <div className="info-contact-icon">🗓️</div>
                <div>
                  <p className="info-contact-label">Hari Operasional</p>
                  <p className="info-contact-value">Senin – Minggu (Setiap Hari)</p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">⏰</div>
                <div>
                  <p className="info-contact-label">Jam Pelayanan Active</p>
                  <p className="info-contact-value">08:00 – 21:00 WIB</p>
                </div>
              </div>

              <div className="info-contact-item">
                <div className="info-contact-icon">⚡</div>
                <div>
                  <p className="info-contact-label">Estimasi Balasan</p>
                  <p className="info-contact-value">15 – 30 Menit pada jam kerja</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoHubungiKami;
