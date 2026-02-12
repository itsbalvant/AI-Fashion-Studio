# AI Fashion Studio – Smart Virtual Styling Platform

A modern, responsive web app that lets users virtually try fashion styles using AI image generation. Built with React and Vite.

## Features

- **Authentication**: Register and login with name, email, password (validation and confirmation)
- **AI Fashion Studio**: Upload or capture a photo; choose gender (Men / Women / Kids) and style (Outfits, Jewellery, Footwear); generate styled images via AI
- **Gallery**: Grid of previously generated styles with hover effects and download
- **Profile**: User info and generated-style count
- **About**: Project description and developer info
- **Dark / Light mode**: Theme toggle with persistence
- **Responsive**: Desktop and laptop friendly; consistent typography and color palette
- **Animations**: Page transitions, hover effects, loading skeleton, subtle background motion

## Tech Stack

- **Frontend**: React 19, React Router 6, CSS Modules
- **AI**: **Google Gemini 2.5 Flash Image** for image generation — free tier (500 images/day), no watermark, good quality. Get an API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

---

## How to setup and run

### Prerequisites

- **Node.js** 18+ (recommended: 20 or 22). Check with `node -v`.
- **npm** (comes with Node). Check with `npm -v`.

### Setup

1. **Go to the project folder**
   ```bash
   cd ai-fashion-studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (for AI image generation)**
   - Create a file named `.env` in the `ai-fashion-studio` folder (same level as `package.json`).
   - Add your Gemini API key:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```
   - Get a free API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
   - Without this key, the app still runs but image generation in the Studio will not work.

### Run the project

**Development (with hot reload):**
```bash
npm run dev
```
Then open the URL shown in the terminal (e.g. **http://localhost:5173**).

**Production build and preview:**
```bash
npm run build
npm run preview
```
Then open the URL shown (e.g. **http://localhost:4173**).

## Project Structure

```
src/
  components/    Layout, ProtectedRoute
  context/       Auth, Theme, Gallery
  pages/         Login, Register, Dashboard, Gallery, Profile, About
  services/      aiApi.js (calls /api/generate-image proxy)
public/          logo.svg
```

## Usage

- **Register** a new account or **log in** with existing credentials (stored locally for this demo).
- On the **Studio** page: optionally upload/capture a photo, select gender and fashion category, pick a style option, then click **Generate style**.
- View past results in **Gallery** and download images.
- Toggle **dark/light** mode from the header.

## Image generation (Gemini)

Image generation uses **Google Gemini 2.5 Flash Image** (free tier: 500 images/day, no watermark). Configure `GEMINI_API_KEY` in `.env` as described in [Setup](#setup). Restart the dev server after adding or changing the key.


## Cross-Platform

Runs in modern browsers on Windows and macOS. No backend required for the demo; auth and gallery use `localStorage`.

## License

Academic / demo use.
