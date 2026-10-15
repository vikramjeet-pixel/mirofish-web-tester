# 🐟 MiroFish Web Tester — Multi-Agent Swarm QA & UX Simulation Engine

> **Reverse-engineering MiroFish's multi-agent swarm intelligence to stress-test web applications, discover edge-case bugs, and predict user conversion.**

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 💡 What is MiroFish Web Tester?

The original **MiroFish** engine introduced a breakthrough concept: instead of relying on a single LLM to guess how humans behave, it synthesizes an entire digital society of hundreds of autonomous AI agents interacting inside a sandbox to predict emergent outcomes.

**MiroFish Web Tester** takes this exact swarm intelligence philosophy and adapts it directly for **Web Applications, SaaS Platforms, and E-Commerce products**.

Instead of waiting for real users to encounter broken buttons, confusing checkout steps, or mobile tap bottlenecks, you simply **paste the URL of your application**. The engine crawls the DOM, synthesizes a diverse swarm of AI user bots (from digital seniors to adversarial chaos fuzzers), and lets them autonomously explore, click, fill inputs, rage-click, and test your app in real time.

---

## ⚡ The 5-Stage MiroFish Architecture

```
[Target Web URL] 
       │
       ▼
 1. Reality Seed & DOM Ingestion (Crawl, forms, buttons, inputs, security headers)
       │
       ▼
 2. Swarm Persona Synthesis (Novices, Speedrunners, Chaos Fuzzers, Impatient Shoppers)
       │
       ▼
 3. Live Swarm Simulation Arena (Multi-Agent Tick Loop, sentiment, frustration, emergent dropoffs)
       │
       ▼
 4. "Interview the Agent" (Direct interrogation modal: ask any bot why it bounced or got confused)
       │
       ▼
 5. Executive Intelligence QA Report (Usability score, bugs registry, reproduction steps, code fixes)
```

### 1. Stage 1: Reality Seed & App Surface Discovery
- Parses `<title>`, meta tags, responsive headings, buttons, forms, inputs, and navigation links.
- Audits network latency and transport security headers (`HSTS`, `X-Frame-Options`, `Content-Security-Policy`).
- Maps out the app into an interactive **Surface Topology Graph**.

### 2. Stage 2: Swarm Persona Synthesis
Generates 10 to 100+ concurrent autonomous agents with distinct behavioral biases:
- 👵 **Nancy Miller (Digital Senior)**: Low tech literacy, intimidated by jargon, needs high-contrast labels and clear visual reassurance.
- ⚡ **Sam Takahashi (Power User / Speedrunner)**: Navigates via rapid Tab/Enter keys, fires concurrent submits, exposes async race conditions.
- 🥊 **Casey Stone (Adversarial Chaos Monkey)**: Fuzzes form inputs with SQLi strings, XSS scripts, negative quantities, and 4,000-character unicode buffers.
- 📱 **Marco Silva (Mobile Commuter on 3G)**: Tests compact viewports (390px), detects sticky banners occluding CTAs, flags touch targets under 44px.
- 🛒 **Sophia Jenkins (Value-Conscious Shopper)**: Tests multi-step carts, watches for hidden fees, detects price jumps.
- ♿ **Aaron Chen (Assistive Tech User)**: Screen reader & keyboard accessibility auditor (WCAG AA contrast, missing `aria-label`s, focus traps).
- 😤 **Ray O'Connor (Rage-Clicker)**: Zero patience; spams clicks 8 times if an async action doesn't display an immediate loading spinner.

### 3. Stage 3: Live Swarm Simulation Arena
- Real-time tick engine displaying active agents navigating the app.
- Live internal monologues, thoughts, and emotional frustration telemetry.
- Real-time metrics: Active Bots, Converted %, Bounced %, Frustration Index %, Bugs Triggered.

### 4. Stage 4: "Interview the Agent" (Signature MiroFish Feature)
- Click on **any bot** in the swarm to view its entire chronological action journey.
- Engage in a live interactive dialogue with the bot!
  - *"Why did you bounce?"*
  - *"What was confusing about the checkout?"*
  - *"Did you find any bugs?"*
- The agent responds dynamically based on its persona, device, and recorded session roadblocks.

### 5. Stage 5: Executive Intelligence Report
- Overall Usability Score (0-100) & UX Resilience Rating.
- Complete Bug Registry with severity ratings (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`), exact DOM selectors, reproduction steps, and suggested code fixes.
- One-click **Markdown Export** & **Copy Report**.

---

## 🚀 Quickstart & Local Development

```bash
# Clone the repository
git clone https://github.com/vikramjeet-pixel/mirofish-web-tester.git
cd mirofish-web-tester

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

```bash
# Deploy with Vercel CLI
npm run build
npx vercel deploy --prod
```

Or connect the repository on your [Vercel Dashboard](https://vercel.com/new).

---

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Glassmorphism UI
- **Icons:** Lucide React
- **Engine:** MiroFish Swarm Simulation Loop & Heuristic DOM Crawler

---

## 📄 License
MIT License. Created by [Vikramjeet Singh](https://github.com/vikramjeet-pixel).
