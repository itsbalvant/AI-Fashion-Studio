import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Google Gemini 2.5 Flash Image — free tier (500 images/day), no watermark, good quality.
// https://ai.google.dev/gemini-api/docs/image-generation

function imageProxyPlugin() {
  return {
    name: 'image-proxy',
    configureServer(server) {
      const env = loadEnv(server.config.mode ?? 'development', process.cwd(), '')
      const apiKey = env.GEMINI_API_KEY

      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || req.url !== '/api/generate-image') {
          return next()
        }
        if (!apiKey) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(
            JSON.stringify({
              error: 'GEMINI_API_KEY is not set. Add it to .env in the ai-fashion-studio folder (get a key at aistudio.google.com/apikey).',
            })
          )
          return
        }
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            const payload = JSON.parse(body || '{}')
            const prompt = payload.prompt || payload.inputs || 'professional fashion photography'
            const gender = payload.gender || 'women'
            const imageBase64 = payload.imageBase64

            const parts = []
            if (imageBase64 && typeof imageBase64 === 'string') {
              parts.push({
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: imageBase64.replace(/^data:[^;]+;base64,/, ''),
                },
              })
              const personDesc = gender === 'men' ? 'male' : gender === 'kids' ? 'child' : 'female'
              const clothingRule =
                gender === 'men'
                  ? "Men's clothing only. No dresses, no women's wear."
                  : gender === 'kids'
                    ? "Kids' clothing only."
                    : "Women's clothing only."
              parts.push({
                text: `This image is the reference person. Generate ONE new photorealistic fashion photo of THIS SAME PERSON wearing: ${payload.styleLabel || 'the chosen style'} (${payload.category || 'fashion category'}). ${clothingRule} Keep the person's face, body type, and identity. Output only the new fashion image, high quality, no text or watermark.`,
              })
            } else {
              parts.push({
                text: `Create a single photorealistic image. ${prompt}`,
              })
            }

            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${encodeURIComponent(apiKey)}`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  contents: [{ parts }],
                  generationConfig: {
                    responseModalities: ['TEXT', 'IMAGE'],
                  },
                }),
              }
            )

            if (!geminiRes.ok) {
              const errText = await geminiRes.text()
              let errMsg = errText
              try {
                const errJson = JSON.parse(errText)
                errMsg = errJson.error?.message || errJson.error?.message || errText
              } catch (_) {}
              res.statusCode = geminiRes.status
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: errMsg }))
              return
            }

            const data = await geminiRes.json()
            const responseParts = data.candidates?.[0]?.content?.parts || []
            let resultBase64 = null
            let mimeType = 'image/png'
            for (const part of responseParts) {
              const inline = part.inlineData || part.inline_data
              if (inline && (inline.data || inline.image_bytes)) {
                resultBase64 = inline.data || inline.image_bytes
                if (inline.mimeType) mimeType = inline.mimeType
                else if (inline.mime_type) mimeType = inline.mime_type
                break
              }
            }

            if (!resultBase64) {
              res.statusCode = 502
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  error: 'Gemini did not return an image. Try a different prompt or check quota at aistudio.google.com.',
                })
              )
              return
            }

            const buf = Buffer.from(resultBase64, 'base64')
            res.statusCode = 200
            res.setHeader('Content-Type', mimeType)
            res.end(buf)
          } catch (e) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e.message || 'Proxy error' }))
          }
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), imageProxyPlugin()],
})
