import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import styles from './Layout.module.css';

export function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.svg" alt="AI Fashion Studio" className={styles.logoImg} />
          <span className={styles.logoText}>AI Fashion Studio</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Studio</Link>
          <Link to="/gallery" className={styles.navLink}>Gallery</Link>
          <Link to="/profile" className={styles.navLink}>Profile</Link>
          <Link to="/about" className={styles.navLink}>About</Link>
          <button
            type="button"
            className={styles.themeBtn}
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {user && (
            <div className={styles.user}>
              <span className={styles.userName}>{user.name}</span>
              <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
