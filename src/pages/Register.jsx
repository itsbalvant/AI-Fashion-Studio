import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AuthFloatingDecor } from '../components/AuthFloatingDecor';
import styles from './Auth.module.css';

const MIN_PASSWORD = 6;

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = register(name.trim(), email.trim(), password);
    setLoading(false);
    if (result.ok) navigate('/', { replace: true });
    else setError(result.error || 'Registration failed.');
  };

  return (
    <div className={styles.page}>
      <AuthFloatingDecor />
      <button
        type="button"
        onClick={toggleTheme}
        className={styles.themeToggle}
        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className={styles.pageContent}>
      <div className={`${styles.card} page-enter`}>
        <div className={styles.logoWrap}>
          <img src="/logo.svg" alt="" className={styles.cardLogo} />
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join AI Fashion Studio</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.error} role="alert">{error}</div>}
          <label className={styles.label}>
            Full name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Your name"
              autoComplete="name"
              required
            />
          </label>
          <label className={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={MIN_PASSWORD}
              required
            />
          </label>
          <label className={styles.label}>
            Confirm password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={styles.input}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
            />
          </label>
          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create account'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
