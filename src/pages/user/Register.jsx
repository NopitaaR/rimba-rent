import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

// ── Icons ──────────────────────────────────────────────

const IconCampfire = () => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.23.1-.47.04-.66-.12a.58.58 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5.14.6.41 1.2.71 1.73 1.08 1.73 2.95 2.97 4.96 3.22 2.14.27 4.43-.12 6.07-1.6 1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26-.77.74zM11.71 19c-1.78-.02-3.47-1.13-4.19-2.76 0 0 1.17.3 2.04-.43.86-.73.62-1.81.62-1.81.88.26 1.56.82 2.14 1.48.33-.26.57-.66.38-1.34-.01-.07-.08-.41-.08-.41.81.32 1.63.88 1.85 1.76.22.93-.08 1.87-.69 2.56C13.16 18.8 12.44 19 11.71 19z" />
  </svg>
);

const IconEyeOpen = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeClosed = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconAlert = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IconCheck = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// ── Helpers ────────────────────────────────────────────

const formatPhone = (value) => {
  return value.replace(/[^\d+\s\-]/g, '');
};

// ── Component ──────────────────────────────────────────

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nomorWhatsApp: '',
    email: '',
    password: '',
    konfirmasiPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ==========================================
  // HANDLE CHANGE
  // ==========================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    const finalValue =
      name === 'nomorWhatsApp'
        ? formatPhone(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  // ==========================================
  // VALIDASI
  // ==========================================

  const validate = () => {
    const newErrors = {};

    if (!formData.namaLengkap.trim()) {
      newErrors.namaLengkap =
        'Nama lengkap wajib diisi.';
    } else if (
      formData.namaLengkap.trim().length < 2
    ) {
      newErrors.namaLengkap =
        'Nama lengkap minimal 2 karakter.';
    }

    if (!formData.nomorWhatsApp.trim()) {
      newErrors.nomorWhatsApp =
        'Nomor WhatsApp wajib diisi.';
    } else if (
      !/^(\+62|62|0)[0-9]{8,13}$/.test(
        formData.nomorWhatsApp.replace(
          /[\s\-]/g,
          ''
        )
      )
    ) {
      newErrors.nomorWhatsApp =
        'Masukkan nomor WhatsApp yang valid.';
    }

    if (!formData.email.trim()) {
      newErrors.email =
        'Email wajib diisi.';
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        'Format email tidak valid.';
    }

    if (!formData.password) {
      newErrors.password =
        'Password wajib diisi.';
    } else if (
      formData.password.length < 8
    ) {
      newErrors.password =
        'Password minimal 8 karakter.';
    }

    if (!formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword =
        'Konfirmasi password wajib diisi.';
    } else if (
      formData.password !==
      formData.konfirmasiPassword
    ) {
      newErrors.konfirmasiPassword =
        'Password tidak cocok.';
    }

    return newErrors;
  };

  // ==========================================
  // SUBMIT REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setSubmitError('');

    try {
      // ======================================
      // KIRIM DATA KE LARAVEL
      // ======================================

      const response = await fetch(
        'http://127.0.0.1:8000/api/register',
        {
          method: 'POST',

          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: formData.namaLengkap.trim(),

            email:
              formData.email
                .trim()
                .toLowerCase(),

            password: formData.password,
          }),
        }
      );

      const result =
        await response.json();

      console.log(
        'REGISTER RESPONSE:',
        result
      );

      // ======================================
      // JIKA GAGAL
      // ======================================

      if (!response.ok) {
        if (
          response.status === 422 &&
          result.errors
        ) {
          const backendErrors = {};

          if (result.errors.email) {
            backendErrors.email =
              result.errors.email[0];
          }

          if (result.errors.name) {
            backendErrors.namaLengkap =
              result.errors.name[0];
          }

          if (result.errors.password) {
            backendErrors.password =
              result.errors.password[0];
          }

          setErrors(backendErrors);

          throw new Error(
            'Data pendaftaran tidak valid.'
          );
        }

        throw new Error(
          result.message ||
          'Pendaftaran gagal.'
        );
      }

      // ======================================
      // USER BERHASIL DIBUAT
      // ======================================

      const user = result.user;

      if (!user || !user.id) {
        throw new Error(
          'Data user dari server tidak valid.'
        );
      }

      // ======================================
      // SIMPAN USER
      // ======================================

      localStorage.setItem(
        'currentUser',
        JSON.stringify({
          id: user.id,

          name: user.name,

          username: user.name
            .toLowerCase()
            .replace(/\s+/g, ''),

          email: user.email,

          phone:
            formData.nomorWhatsApp,

          avatar: '',

          role: 'Customer Active',
        })
      );

      localStorage.setItem(
        'userRole',
        'user'
      );

      window.dispatchEvent(
        new Event('bara_user_updated')
      );

      // ======================================
      // SUCCESS
      // ======================================

      setIsSuccess(true);

      // Setelah berhasil daftar,
      // kembali ke halaman login
      setTimeout(() => {
        navigate('/');
      }, 1800);

    } catch (error) {
      console.error(
        'REGISTER ERROR:',
        error
      );

      if (
        !error.message.includes(
          'Data pendaftaran tidak valid'
        )
      ) {
        setSubmitError(
          error.message ||
          'Pendaftaran gagal. Silakan coba lagi.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* HEADER */}

        <div className="auth-header">

          <div className="auth-brand">

            <div className="auth-brand-icon">
              <IconCampfire />
            </div>

            <div className="auth-brand-name">
              Bara Rimba Rent

              <span>
                Rental Alat Camping &amp; BBQ
              </span>
            </div>

          </div>

          <div className="auth-divider-line" />

          <h1 className="auth-title">
            Daftar Akun
          </h1>

          <p className="auth-subtitle">
            Buat akun untuk mulai menyewa
            perlengkapan.
          </p>

        </div>

        {/* ERROR */}

        {submitError && (
          <div
            className="auth-alert error"
            role="alert"
          >
            <IconAlert />

            <span>
              {submitError}
            </span>
          </div>
        )}

        {/* SUCCESS */}

        {isSuccess && (
          <div
            className="auth-alert success"
            role="status"
          >
            <IconCheck />

            <span>
              Akun berhasil dibuat!
              Mengarahkan ke halaman login...
            </span>
          </div>
        )}

        {/* FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* NAMA */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="reg-nama"
            >
              Nama Lengkap
            </label>

            <div className="form-input-wrapper">

              <input
                id="reg-nama"
                type="text"
                name="namaLengkap"
                className={`form-input${errors.namaLengkap
                    ? ' input-error'
                    : ''
                  }`}
                placeholder="Masukkan nama lengkap"
                value={
                  formData.namaLengkap
                }
                onChange={handleChange}
                autoComplete="name"
                disabled={
                  isLoading || isSuccess
                }
              />

            </div>

            {errors.namaLengkap && (
              <span className="form-error-text">
                <IconAlert />
                {errors.namaLengkap}
              </span>
            )}

          </div>

          {/* WHATSAPP */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="reg-wa"
            >
              Nomor WhatsApp
            </label>

            <div className="form-input-wrapper">

              <input
                id="reg-wa"
                type="tel"
                name="nomorWhatsApp"
                className={`form-input${errors.nomorWhatsApp
                    ? ' input-error'
                    : ''
                  }`}
                placeholder="Masukkan nomor WhatsApp"
                value={
                  formData.nomorWhatsApp
                }
                onChange={handleChange}
                autoComplete="tel"
                disabled={
                  isLoading || isSuccess
                }
              />

            </div>

            {errors.nomorWhatsApp && (
              <span className="form-error-text">
                <IconAlert />
                {errors.nomorWhatsApp}
              </span>
            )}

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="reg-email"
            >
              Email
            </label>

            <div className="form-input-wrapper">

              <input
                id="reg-email"
                type="email"
                name="email"
                className={`form-input${errors.email
                    ? ' input-error'
                    : ''
                  }`}
                placeholder="Masukkan email"
                value={
                  formData.email
                }
                onChange={handleChange}
                autoComplete="email"
                disabled={
                  isLoading || isSuccess
                }
              />

            </div>

            {errors.email && (
              <span className="form-error-text">
                <IconAlert />
                {errors.email}
              </span>
            )}

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="reg-password"
            >
              Password
            </label>

            <div className="form-input-wrapper">

              <input
                id="reg-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                name="password"
                className={`form-input has-icon${errors.password
                    ? ' input-error'
                    : ''
                  }`}
                placeholder="Masukkan password"
                value={
                  formData.password
                }
                onChange={handleChange}
                autoComplete="new-password"
                disabled={
                  isLoading || isSuccess
                }
              />

              <button
                type="button"
                className="input-icon-btn"
                onClick={() =>
                  setShowPassword(
                    (v) => !v
                  )
                }
                aria-label={
                  showPassword
                    ? 'Sembunyikan password'
                    : 'Tampilkan password'
                }
                tabIndex={-1}
              >
                {showPassword ? (
                  <IconEyeClosed />
                ) : (
                  <IconEyeOpen />
                )}
              </button>

            </div>

            {errors.password ? (
              <span className="form-error-text">
                <IconAlert />
                {errors.password}
              </span>
            ) : (
              <span className="password-hint">
                Minimal 8 karakter
              </span>
            )}

          </div>

          {/* KONFIRMASI PASSWORD */}

          <div className="form-group">

            <label
              className="form-label"
              htmlFor="reg-konfirmasi"
            >
              Konfirmasi Password
            </label>

            <div className="form-input-wrapper">

              <input
                id="reg-konfirmasi"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                name="konfirmasiPassword"
                className={`form-input has-icon${errors.konfirmasiPassword
                    ? ' input-error'
                    : ''
                  }`}
                placeholder="Masukkan ulang password"
                value={
                  formData.konfirmasiPassword
                }
                onChange={handleChange}
                autoComplete="new-password"
                disabled={
                  isLoading || isSuccess
                }
              />

              <button
                type="button"
                className="input-icon-btn"
                onClick={() =>
                  setShowConfirmPassword(
                    (v) => !v
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? 'Sembunyikan password'
                    : 'Tampilkan password'
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <IconEyeClosed />
                ) : (
                  <IconEyeOpen />
                )}
              </button>

            </div>

            {errors.konfirmasiPassword && (
              <span className="form-error-text">
                <IconAlert />
                {errors.konfirmasiPassword}
              </span>
            )}

          </div>

          {/* SUBMIT */}

          <button
            id="btn-register-submit"
            type="submit"
            className="btn-auth"
            disabled={
              isLoading || isSuccess
            }
            style={{
              marginTop:
                'var(--spacing-sm)',
            }}
          >
            <div className="btn-auth-inner">

              {isLoading && (
                <div className="btn-spinner" />
              )}

              <span>
                {isLoading
                  ? 'Mendaftar...'
                  : isSuccess
                    ? 'Berhasil!'
                    : 'Daftar'}
              </span>

            </div>
          </button>

          {/* LOGIN LINK */}

          <div className="auth-footer">

            <p className="auth-footer-text">
              Sudah memiliki akun?{' '}

              <Link
                to="/"
                className="auth-footer-link"
              >
                Masuk
              </Link>
            </p>

          </div>

        </form>

      </div>
    </div>
  );
}

export default Register;