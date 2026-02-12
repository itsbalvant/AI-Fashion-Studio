# ✨ AI Fashion Studio

**Try fashion styles virtually with AI.** Upload a photo, pick a category and style, and get AI-generated looks in seconds—powered by Google Gemini.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)

---

## 📌 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [API Key](#-api-key--gemini)
- [Author & License](#-author--license)

---

## 🎯 About

**AI Fashion Studio** is a modern web app that lets you experiment with fashion using AI image generation. Choose who the look is for (Men, Women, or Kids), pick a category—**Outfits**, **Jewellery**, or **Footwear**—and generate styled images from your photo. No backend required for auth or gallery; everything runs in the browser with an optional Gemini API key for generation.

Built as a portfolio project with a clean UI, glassmorphism auth screens, dark/light mode, and a responsive layout.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| **Auth** | Register, login, and forgot-password flow with validation (data stored in `localStorage`) |
| **AI Studio** | Upload or capture a photo → select gender & category → choose style → generate styled image via Gemini |
| **Gallery** | Grid of your generated looks with hover effects and one-click download |
| **Profile** | View your info and total generated styles count |
| **Theme** | Dark / light mode with toggle and persistence |
| **UI** | Glassmorphism login/register, floating decor, smooth animations, responsive layout |

---

## 🛠 Tech Stack

- **Frontend:** React 19, React Router 6, CSS Modules, Vite 7  
- **AI:** Google Gemini 2.5 Flash (image generation) — [free tier](https://aistudio.google.com/apikey): 500 images/day, no watermark  
- **Storage:** Browser `localStorage` for auth and gallery (no server)

---

## 📦 Installation

### Prerequisites

- **Node.js** 18 or higher (20+ recommended). Check: `node -v`
- **npm** (included with Node). Check: `npm -v`

### Steps

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/ai-fashion-studio.git
cd ai-fashion-studio
```

*(Replace `YOUR_USERNAME` with your GitHub username.)*

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root (same folder as `package.json`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

- Get a **free** API key: [Google AI Studio → Get API key](https://aistudio.google.com/apikey)  
- **Use your own key** — sharing one key across machines causes quota and expiry errors.  
- Without this key, the app still runs; only the **Generate style** feature in the Studio will not work.

**4. Start the development server**

```bash
npm run dev
```

Open the URL shown in the terminal (e.g. **http://localhost:5173**).

### Production build

```bash
npm run build
npm run preview
```

Then open the URL shown (e.g. **http://localhost:4173**).

---

## 📖 How to Use

### 1. Sign up or log in

- Open the app and go to **Register** to create an account (name, email, password).
- Or use **Login** if you already have an account.  
- Credentials are stored locally in your browser for this demo.

### 2. Use the AI Studio

- From the dashboard, go to **Studio** (or the main “AI Fashion Studio” entry).
- **Upload a photo** or use **Capture** (if your device supports it).
- Choose **Who it’s for:** Men / Women / Kids.
- Choose **Category:** Outfits / Jewellery / Footwear.
- Pick a **style** from the options (e.g. casual, formal, seasonal).
- Click **Generate style**.  
- The AI will return a styled image; you can view it and, if you want, generate again with different options.

### 3. Gallery & Profile

- **Gallery:** See all your generated images in a grid. Hover for actions and use the download option to save.
- **Profile:** View your name and how many styles you’ve generated.
- Use the **theme toggle** (sun/moon) in the header to switch between light and dark mode.

### 4. About

- The **About** page has a short project description and developer contact.

---

## 📁 Project Structure

```
ai-fashion-studio/
├── public/           # Static assets (e.g. logo.svg)
├── src/
│   ├── components/   # Layout, ProtectedRoute, AuthFloatingDecor
│   ├── context/      # Auth, Theme, Gallery
│   ├── pages/        # Login, Register, Dashboard, Gallery, Profile, About
│   ├── services/     # aiApi.js (Gemini image generation)
│   ├── App.jsx
│   └── main.jsx
├── .env.example      # Example env (no real keys)
├── package.json
└── README.md
```

---

## 🔑 API Key & Gemini

- Image generation uses **Google Gemini 2.5 Flash** (image generation API).
- **Free tier:** 500 images per day per API key, no watermark.
- **Setup:** Put your key in `.env` as `GEMINI_API_KEY`. Restart the dev server after changing it.
- **Important:** Each developer should use their own key; do not commit `.env` or share keys (see [Installation](#3-set-up-environment-variables)).

---

This project is for **learning and portfolio** use. Feel free to fork and adapt; attribution is appreciated.

---

**Star ⭐ the repo if you find it useful.**
