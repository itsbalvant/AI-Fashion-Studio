import { useAuth } from '../context/AuthContext';
import { useGallery } from '../context/GalleryContext';
import styles from './Profile.module.css';

export function Profile() {
  const { user } = useAuth();
  const { items } = useGallery();

  return (
    <div className={`${styles.wrapper} page-enter`}>
      <h1 className={styles.heading}>Profile</h1>
      <div className={styles.card}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
        <h2 className={styles.name}>{user?.name}</h2>
        <p className={styles.email}>{user?.email}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{items.length}</span>
            <span className={styles.statLabel}>Generated styles</span>
          </div>
        </div>
        <p className={styles.note}>
          Profile data is stored locally for this demo. No backend is connected.
        </p>
      </div>
    </div>
  );
}
