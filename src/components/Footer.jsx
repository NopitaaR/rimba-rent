import { Link } from 'react-router-dom';
import './Footer.css';

const IconCampfire = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26-.77.74zM11.71 19c-1.78-.02-3.47-1.13-4.19-2.76 0 0 1.17.3 2.04-.43.86-.73.62-1.81.62-1.81.88.26 1.56.82 2.14 1.48.33-.26.57-.66.38-1.34-.01-.07-.08-.41-.08-.41.81.32 1.63.88 1.85 1.76.22.93-.08 1.87-.69 2.56C13.16 18.8 12.44 19 11.71 19z"/>
  </svg>
);

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-main">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-row">
            <div className="footer-brand-icon"><IconCampfire /></div>
            <div>
              <div className="footer-brand-name">Bara Rimba Rent</div>
              <div className="footer-brand-tagline">Rental Alat Camping &amp; BBQ</div>
            </div>
          </div>
          <p className="footer-desc">
            Solusi sewa perlengkapan camping dan BBQ berkualitas untuk petualangan
            tak terlupakan bersama keluarga dan teman.
          </p>
        </div>

        {/* Navigasi */}
        <div>
          <p className="footer-col-title">Navigasi</p>
          <div className="footer-links">
            <Link to="/dashboard" className="footer-link">Beranda</Link>
            <Link to="/products" className="footer-link">Produk</Link>
          </div>
        </div>

        {/* Akun */}
        <div>
          <p className="footer-col-title">Akun</p>
          <div className="footer-links">
            <Link to="/" className="footer-link">Masuk</Link>
            <Link to="/register" className="footer-link">Daftar</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            &copy; {year} Bara Rimba Rent. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
