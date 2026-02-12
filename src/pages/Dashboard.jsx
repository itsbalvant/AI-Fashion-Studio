import { useState, useRef, useEffect } from 'react';
import { useGallery } from '../context/GalleryContext';
import { generateFashionImage } from '../services/aiApi';
import styles from './Dashboard.module.css';

const GENDERS = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
];

const CATEGORIES = [
  { id: 'outfits', label: 'Outfits / Dresses' },
  { id: 'jewellery', label: 'Jewellery / Accessories' },
  { id: 'footwear', label: 'Footwear / Slippers / Shoes' },
];

const STYLE_OPTIONS = {
  outfits: ['Evening gown', 'Casual wear', 'Formal suit', 'Street style', 'Traditional wear'],
  jewellery: ['Earrings & necklace', 'Bracelets & rings', 'Statement jewellery', 'Minimal accessories', 'Luxury watch'],
  footwear: ['Sneakers', 'Heels', 'Sandals', 'Formal shoes', 'Boots'],
};

export function Dashboard() {
  const [gender, setGender] = useState('women');
  const [category, setCategory] = useState('outfits');
  const [styleLabel, setStyleLabel] = useState(STYLE_OPTIONS.outfits[0]);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { addItem } = useGallery();

  // Attach stream to video when camera is active and video is mounted
  useEffect(() => {
    if (!cameraActive || !videoRef.current || !streamRef.current) return;
    videoRef.current.srcObject = streamRef.current;
    return () => {
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [cameraActive]);

  const stylesForCategory = STYLE_OPTIONS[category] || STYLE_OPTIONS.outfits;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
      setResultUrl(null);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      setCameraActive(true);
    } catch (err) {
      setError('Camera access denied or unavailable.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    const url = canvas.toDataURL('image/jpeg');
    setPhotoPreview(url);
    stopCamera();
    setResultUrl(null);
  };

  const handleGenerate = async () => {
    setError('');
    setResultUrl(null);
    setLoading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 90));
    }, 400);
    try {
      const res = await generateFashionImage({
        gender,
        category,
        styleLabel,
        imageDataUrl: photoPreview && photoPreview.startsWith('data:') ? photoPreview : null,
      });
      clearInterval(interval);
      setProgress(100);
      if (res.ok) {
        setResultUrl(res.imageUrl);
        addItem({
          imageUrl: res.imageUrl,
          gender,
          category,
          styleLabel,
          createdAt: new Date().toISOString(),
        });
      } else {
        setError(res.error || 'Generation failed.');
      }
    } catch (e) {
      clearInterval(interval);
      setError(e.message || 'Something went wrong.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className={`${styles.wrapper} page-enter`}>
      <h1 className={styles.heading}>AI Fashion Studio</h1>
      <p className={styles.tagline}>Choose your look. We'll generate it with AI.</p>

      <div className={styles.grid}>
        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Your photo (optional)</h2>
          <div className={styles.photoArea}>
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className={styles.previewImg} />
            ) : (
              <div className={styles.placeholder}>
                <p>Upload or capture</p>
                <div className={styles.photoActions}>
                  <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload
                  </button>
                  <button type="button" className={styles.btnSecondary} onClick={startCamera}>
                    Camera
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className={styles.hiddenInput}
                />
              </div>
            )}
            {photoPreview && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setPhotoPreview(null); setResultUrl(null); }}
              >
                Clear
              </button>
            )}
          </div>
          {cameraActive && (
            <div className={styles.cameraBox}>
              <video ref={videoRef} autoPlay playsInline muted className={styles.video} />
              <div className={styles.cameraActions}>
                <button type="button" className={styles.btnPrimary} onClick={capturePhoto}>
                  Capture photo
                </button>
                <button type="button" className={styles.btnSecondary} onClick={stopCamera}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          <h2 className={styles.panelTitle}>Gender / Category</h2>
          <div className={styles.chips}>
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                className={gender === g.id ? styles.chipActive : styles.chip}
                onClick={() => setGender(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <h2 className={styles.panelTitle}>Fashion style</h2>
          <div className={styles.chips}>
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                className={category === c.id ? styles.chipActive : styles.chip}
                onClick={() => { setCategory(c.id); setStyleLabel(STYLE_OPTIONS[c.id][0]); }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <h2 className={styles.panelTitle}>Style option</h2>
          <select
            value={styleLabel}
            onChange={(e) => setStyleLabel(e.target.value)}
            className={styles.select}
          >
            {stylesForCategory.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {error && <div className={styles.error}>{error}</div>}
          {loading && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
              <span className={styles.progressText}>Generating…</span>
            </div>
          )}
          <button
            type="button"
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate style'}
          </button>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Result</h2>
          <div className={styles.resultArea}>
            {resultUrl ? (
              <>
                <img src={resultUrl} alt="Generated style" className={styles.resultImg} />
                <a
                  href={resultUrl}
                  download="ai-fashion-studio-result.png"
                  className={styles.downloadBtn}
                >
                  Download
                </a>
              </>
            ) : (
              <div className={styles.resultPlaceholder}>
                <div className="skeleton" style={{ width: '100%', height: 320, borderRadius: 12 }} />
                <p className={styles.resultHint}>Select options and click Generate style</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
