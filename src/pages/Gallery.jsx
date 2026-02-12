import { useState } from 'react';
import { useGallery } from '../context/GalleryContext';
import styles from './Gallery.module.css';

export function Gallery() {
  const { items, removeItem } = useGallery();
  const [selected, setSelected] = useState(null);

  if (items.length === 0) {
    return (
      <div className={`${styles.wrapper} page-enter`}>
        <h1 className={styles.heading}>Gallery</h1>
        <p className={styles.tagline}>Your generated fashion styles will appear here.</p>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>✨</div>
          <p>No styles yet</p>
          <p className={styles.emptyHint}>Generate looks from the Studio to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} page-enter`}>
      <h1 className={styles.heading}>Gallery</h1>
      <p className={styles.tagline}>Previously generated fashion styles</p>
      <div className={styles.grid}>
        {items.map((item) => (
          <article
            key={item.id}
            className={styles.card}
            onMouseEnter={() => setSelected(item.id)}
            onMouseLeave={() => setSelected(null)}
          >
            <div className={styles.imgWrap}>
              <img src={item.imageUrl} alt={item.styleLabel} className={styles.img} />
              <div className={`${styles.overlay} ${selected === item.id ? styles.overlayVisible : ''}`}>
                <span className={styles.meta}>{item.styleLabel}</span>
                <span className={styles.meta}>{item.gender} · {item.category}</span>
                <div className={styles.actions}>
                  <a href={item.imageUrl} download={`fashion-${item.id}.png`} className={styles.actionBtn}>
                    Download
                  </a>
                  <button
                    type="button"
                    className={styles.actionBtnDanger}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
