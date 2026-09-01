import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

// ── Icons ──────────────────────────────────────────────
const IconCampfire = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26-.77.74zM11.71 19c-1.78-.02-3.47-1.13-4.19-2.76 0 0 1.17.3 2.04-.43.86-.73.62-1.81.62-1.81.88.26 1.56.82 2.14 1.48.33-.26.57-.66.38-1.34-.01-.07-.08-.41-.08-.41.81.32 1.63.88 1.85 1.76.22.93-.08 1.87-.69 2.56C13.16 18.8 12.44 19 11.71 19z" />
  </svg>
);

const IconEyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeClosed = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ── Component ──────────────────────────────────────────
function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (loginError) setLoginError('');
  };

  const validate = () => {
    const newErrors = {};
    const inputVal = formData.email.trim();
    if (!inputVal) {
      newErrors.email = 'Email atau Username wajib diisi.';
    } else if (inputVal !== 'admin' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputVal)) {
      newErrors.email = 'Format email tidak valid.';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi.';
    } else if (inputVal !== 'admin' && formData.password.length < 5) {
      newErrors.password = 'Password minimal 5 karakter.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setIsLoading(true);
    setLoginError('');

    setTimeout(() => {
      setIsLoading(false);
      const inputVal = formData.email.trim();
      const isAdminAccount = inputVal === 'admin' || inputVal === 'admin@bara.com';

      if (isAdminAccount) {
        if (formData.password === 'admin') {
          localStorage.setItem('userRole', 'admin');
          navigate('/admin/dashboard');
        } else {
          setLoginError('Username/email atau password salah. Silakan coba lagi.');
        }
      } else if (inputVal && formData.password) {
        localStorage.setItem('userRole', 'user');

        const emailLower = inputVal.toLowerCase();
        let name = inputVal.includes('@') ? inputVal.split('@')[0] : inputVal;
        let email = inputVal.includes('@') ? inputVal : `${inputVal}@gmail.com`;

        if (emailLower === 'budi@gmail.com' || emailLower === 'budi') {
          name = 'Budi Santoso';
          email = 'budi@gmail.com';
        } else if (emailLower === 'siti@gmail.com' || emailLower === 'siti') {
          name = 'Siti Aminah';
          email = 'siti@gmail.com';
        } else if (emailLower === 'rizky@gmail.com' || emailLower === 'rizky') {
          name = 'Rizky Pratama';
          email = 'rizky@gmail.com';
        } else if (emailLower === 'dedi@gmail.com' || emailLower === 'dedi') {
          name = 'Dedi Kurniawan';
          email = 'dedi@gmail.com';
        } else if (emailLower === 'anisa@gmail.com' || emailLower === 'anisa') {
          name = 'Anisa Rahma';
          email = 'anisa@gmail.com';
        }

        const existingUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (!existingUser.email || existingUser.email.toLowerCase() !== email.toLowerCase()) {
          localStorage.setItem('currentUser', JSON.stringify({
            name,
            username: name.toLowerCase().replace(/\s+/g, ''),
            email,
            phone: existingUser.phone || '081234567890',
            avatar: existingUser.avatar || '',
            role: 'Customer Active',
          }));
          window.dispatchEvent(new Event('bara_user_updated'));
        }

        navigate('/dashboard');
      } else {
        setLoginError('Username/email atau password salah. Silakan coba lagi.');
      }
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* ── Header ── */}
        <div className="auth-header">
          <div className="auth-brand">
            <div className="auth-brand-icon"><IconCampfire /></div>
            <div className="auth-brand-name">
              Bara Rimba Rent
              <span>Rental Alat Camping &amp; BBQ</span>
            </div>
          </div>
          <div className="auth-divider-line" />
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Masuk untuk melanjutkan penyewaan perlengkapan.</p>
        </div>

        {/* ── Global error ── */}
        {loginError && (
          <div className="auth-alert error" role="alert">
            <IconAlert /><span>{loginError}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          {/* Email / Username */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email / Username</label>
            <div className="form-input-wrapper">
              <input id="login-email" type="text" name="email"
                className={`form-input${errors.email ? ' input-error' : ''}`}
                placeholder="Masukkan email atau username (admin)" value={formData.email}
                onChange={handleChange} autoComplete="username" disabled={isLoading} />
            </div>
            {errors.email && <span className="form-error-text"><IconAlert />{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="form-input-wrapper">
              <input id="login-password" type={showPassword ? 'text' : 'password'} name="password"
                className={`form-input has-icon${errors.password ? ' input-error' : ''}`}
                placeholder="Masukkan password" value={formData.password}
                onChange={handleChange} autoComplete="current-password" disabled={isLoading} />
              <button type="button" className="input-icon-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                tabIndex={-1}>
                {showPassword ? <IconEyeClosed /> : <IconEyeOpen />}
              </button>
            </div>
            {errors.password && <span className="form-error-text"><IconAlert />{errors.password}</span>}
          </div>

          {/* Remember me */}
          <div className="form-options-row">
            <label className="checkbox-wrapper">
              <input type="checkbox" name="rememberMe"
                checked={formData.rememberMe} onChange={handleChange} disabled={isLoading} />
              <span className="checkbox-label">Ingat saya</span>
            </label>
          </div>

          {/* Submit */}
          <button id="btn-login-submit" type="submit" className="btn-auth" disabled={isLoading}>
            <div className="btn-auth-inner">
              {isLoading && <div className="btn-spinner" />}
              <span>{isLoading ? 'Memproses...' : 'Masuk'}</span>
            </div>
          </button>

          {/* Register link */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              Belum punya akun?{' '}
              <Link to="/register" className="auth-footer-link">Daftar</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;