# MiniSentinel — Mini SIEM Dashboard

A modern, cyberpunk-themed security dashboard built with React, featuring GLSL shaders, GSAP animations, and smooth scroll effects.

![MiniSentinel Dashboard](https://img.shields.io/badge/Status-Live-00ff88?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

- **Real-time Log Simulation** — Live log stream with customizable generation rate
- **Threat Detection Rules** — Brute force, DDoS, and suspicious access detection
- **Alert Management** — Track, acknowledge, and resolve security alerts
- **Interactive Dashboard** — Stats cards, charts, and system status monitoring
- **GLSL Shader Background** — Animated cyber grid with glow effects
- **Smooth Animations** — GSAP ScrollTrigger with Lenis smooth scroll

## 🎨 Design

- **Dark Cyberpunk Aesthetic** — Pure black backgrounds with cyan/green accents
- **Bold Typography** — Orbitron for headers, JetBrains Mono for data
- **Glow Effects** — Neon glows on interactive elements
- **Responsive Layout** — Works on desktop and tablet devices

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite 6 |
| Styling | Vanilla CSS with custom properties |
| 3D/Shaders | React Three Fiber + Custom GLSL |
| Animation | GSAP + ScrollTrigger |
| Scroll | Lenis Smooth Scroll |
| Icons | Lucide React |
| Routing | React Router DOM |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/minisentinal.git
cd minisentinal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
minisentinal/
├── src/
│   ├── animations/      # GSAP presets
│   ├── components/      # React components
│   ├── data/            # Mock data generators
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── shaders/         # GLSL shaders
│   └── styles/          # CSS files
├── public/              # Static assets
└── .github/workflows/   # CI/CD
```

## 📊 Pages

| Page | Description |
|------|-------------|
| Dashboard | Overview with stats, logs, alerts, and system status |
| Logs Explorer | Search and filter through collected logs |
| Alerts Panel | Manage security alerts with status tracking |
| Rules Config | View and toggle detection rules |

## 🔐 Detection Rules

Based on the SRS requirements:

1. **Brute Force Detection** — 5+ failed logins from same IP in 60 seconds
2. **DDoS Detection** — 100+ requests from same IP in 10 seconds  
3. **Suspicious Access** — Access to forbidden endpoints

## 🌐 Deployment

This project is configured for GitHub Pages deployment:

1. Push to `main` branch
2. GitHub Actions automatically builds and deploys
3. Access at `https://yourusername.github.io/minisentinal/`

## 📜 License

MIT License — feel free to use this for learning and projects!

---

Built with 🖤 using React, Three.js, and GSAP
