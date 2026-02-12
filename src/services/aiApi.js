/**
 * AI Image generation for fashion styling.
 * Calls our backend proxy (/api/generate-image); the server uses Google Gemini 2.5 Flash Image (GEMINI_API_KEY).
 */

function buildPrompt(gender, category, styleLabel) {
  if (gender === 'men') {
    return `Professional fashion photography of a MALE adult model only. He must be wearing ${styleLabel} (${category}). Men's clothing only, masculine style. No dresses, no women's wear, no feminine clothing. Clean studio lighting, editorial, high quality, sharp focus. No watermark, no text, no logo.`;
  }
  if (gender === 'kids') {
    return `Professional fashion photography of a CHILD model only. The child must be wearing ${styleLabel} (${category}). Kids' clothing only. Clean studio lighting, editorial, high quality, sharp focus. No watermark, no text, no logo.`;
  }
  return `Professional fashion photography of a FEMALE adult model only. She must be wearing ${styleLabel} (${category}). Women's clothing only, feminine style. Clean studio lighting, editorial, high quality, sharp focus. No watermark, no text, no logo.`;
}

/**
 * Generates a fashion image. Returns { ok: true, imageUrl } or { ok: false, error }.
 * imageDataUrl: optional data URL (e.g. from upload/camera) so the person's photo is used as reference.
 */
export async function generateFashionImage({ gender, category, styleLabel, imageDataUrl }) {
  const prompt = buildPrompt(gender, category, styleLabel);
  let imageBase64 = null;
  if (imageDataUrl && typeof imageDataUrl === 'string' && imageDataUrl.startsWith('data:')) {
    const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (match) imageBase64 = match[2];
  }

  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        gender,
        category,
        styleLabel,
        ...(imageBase64 && { imageBase64 }),
      }),
    });

    if (res.status === 429) {
      return { ok: false, error: 'Rate limit exceeded. Please try again in a few minutes.' };
    }
    if (res.status === 503) {
      return { ok: false, error: 'Model is loading. Please retry in 20–30 seconds.' };
    }
    if (res.status === 500) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.error || await res.text() || 'Server error.';
      if (/not set|api key/i.test(msg)) {
        return { ok: false, error: 'API key not configured on server. Add VITE_HF_API_KEY to .env and restart.' };
      }
      return { ok: false, error: msg };
    }
    if (!res.ok) {
      const err = await res.text();
      return { ok: false, error: err || 'Generation failed.' };
    }

    const blob = await res.blob();
    const imageUrl = URL.createObjectURL(blob);
    return { ok: true, imageUrl };
  } catch (e) {
    const msg = e.message || 'Network error.';
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return { ok: false, error: 'Cannot reach server. In production, run the backend (see README).' };
    }
    return { ok: false, error: msg };
  }
}

/** Placeholder when no server or key (e.g. static deploy without backend). */
export function getFallbackImageUrl() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2d2a26"/>
          <stop offset="100%" style="stop-color:#1a1918"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <text x="256" y="240" text-anchor="middle" fill="rgba(212,168,75,0.9)" font-family="system-ui" font-size="18">AI Fashion Studio</text>
      <text x="256" y="270" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="system-ui" font-size="12">Demo preview</text>
      <text x="256" y="300" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-family="system-ui" font-size="10">Add VITE_HF_API_KEY and restart dev server</text>
    </svg>
  `;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}
