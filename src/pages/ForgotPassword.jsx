import { Link } from 'react-router-dom';
import { AuthFloatingDecor } from '../components/AuthFloatingDecor';
import styles from './Auth.module.css';

export function ForgotPassword() {
  return (
    <div className={styles.page}>
      <AuthFloatingDecor />
      <div className={styles.pageContent}>
      <div className={`${styles.card} page-enter`}>
        <div className={styles.logoWrap}>
          <img src="/logo.svg" alt="" className={styles.cardLogo} />
          <h1 className={styles.title}>Forgot password?</h1>
          <p className={styles.subtitle}>
            For demo purposes, password reset is not implemented. Use your existing account or register a new one.
          </p>
        </div>
        <p className={styles.footer}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </div>
      </div>
    </div>
  );
}
