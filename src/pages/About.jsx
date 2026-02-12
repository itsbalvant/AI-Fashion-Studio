import { Link } from 'react-router-dom';
import styles from './About.module.css';

export function About() {
  return (
    <div className={`${styles.wrapper} page-enter`}>
      <h1 className={styles.heading}>About</h1>
      <div className={styles.card}>
        <h2 className={styles.title}>AI Fashion Studio</h2>
        <p className={styles.subtitle}>Smart virtual styling with AI</p>
        <p className={styles.body}>
          AI Fashion Studio lets you try fashion styles virtually. Upload or capture a photo,
          choose who it’s for (Men, Women, or Kids), pick a category—Outfits, Jewellery, or
          Footwear—and get AI-generated styled images powered by Google Gemini.
        </p>
        <p className={styles.body}>
          The app is built with React and Vite. It includes sign-up and login, an AI Studio
          to generate looks, a gallery to view and download results, and a profile page. Auth
          and gallery data are stored locally in the browser; for AI generation you add a
          Gemini API key in <code>.env</code> as <code>GEMINI_API_KEY</code> (free tier available).
        </p>
        <h3 className={styles.sectionTitle}>Developer</h3>
        <p className={styles.body}>
          Designed and built by <strong>Dharshini Venkatesan</strong>. This project is for
          learning and portfolio use. It runs in modern browsers on desktop and laptop, with
          no backend required for the demo.
        </p>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <p className={styles.body}>
          Questions, feedback, or collaboration ideas? Reach out.
        </p>
        <div className={styles.contactBlock}>
          <span className={styles.contactName}>xyz abcd</span>
          <a href="mailto:xyz@gmail.com" className={styles.contactEmail}>
            xyz@gmail.com
          </a>
        </div>
        <Link to="/" className={styles.backLink}>← Back to Studio</Link>
      </div>
    </div>
  );
}
