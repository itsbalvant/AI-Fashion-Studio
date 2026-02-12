import { useState, useCallback } from 'react';
import styles from '../pages/Auth.module.css';

const EMOJIS = ['👕', '🧥', '👟', '👠', '💍', '📿', '👗', '👔', '👜', '💎', '🥿', '🕶️', '⌚', '🧣', '👒', '🩱', '💄', '🪮', '🧴', '✨'];

export function AuthFloatingDecor() {
  const [pop, setPop] = useState(null);

  const handlePhotoClick = useCallback((e, index) => {
    e.stopPropagation();
    setPop({ type: 'photo', index });
    setTimeout(() => setPop(null), 450);
  }, []);

  const handleIconClick = useCallback((e, index) => {
    e.stopPropagation();
    setPop({ type: 'icon', index });
    setTimeout(() => setPop(null), 450);
  }, []);

  return (
    <>
      <div className={styles.vibeOrbs} aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <span key={i} className={styles.vibeOrb} />
        ))}
      </div>
      <div className={styles.floatingPhotos} aria-hidden="true">
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            className={`${styles.floatingPhoto} ${pop?.type === 'photo' && pop?.index === i ? styles.clickPop : ''}`}
            onClick={(e) => handlePhotoClick(e, i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handlePhotoClick(e, i)}
            aria-label="Fashion photo"
          />
        ))}
      </div>
      <div className={styles.floatingIcons} aria-hidden="true">
        {EMOJIS.map((emoji, i) => (
          <span
            key={i}
            className={`${styles.floatIcon} ${pop?.type === 'icon' && pop?.index === i ? styles.clickPop : ''}`}
            onClick={(e) => handleIconClick(e, i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleIconClick(e, i)}
            aria-label={`Fashion item ${emoji}`}
          >
            {emoji}
          </span>
        ))}
      </div>
    </>
  );
}
