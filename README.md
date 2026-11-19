# OpsPilot — Enterprise Operations Management Platform

A frontend portfolio project built with React, TypeScript, and Vite. OpsPilot is a fictional enterprise operations dashboard inspired by real-world production, warehouse, maintenance, and power-operations workflows.

## Features

- Responsive enterprise dashboard with KPI cards and operational performance chart
- Project overview with progress and status indicators
- Task management with search, status filters, and task creation
- JSON-driven dynamic form renderer with typed field configuration and native validation
- Local persistence for task changes using `localStorage`
- PWA manifest and a basic service worker for production builds
- Reusable UI components and typed domain models

## Tech stack

- React 18 + TypeScript
- Vite
- React Router
- Recharts
- Lucide React
- CSS (responsive, custom design system)

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Install and run

```bash
# 1. Extract the ZIP and open the project folder
cd opspilot-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Project structure

```text
opspilot-portfolio/
├── public/
│   ├── manifest.webmanifest
│   └── sw.js
├── src/
│   ├── App.tsx
│   ├── data.ts
│   ├── main.tsx
│   ├── styles.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Demo data and limitations

All organizations, people, metrics, and records shown in this project are fictional demo data. This is a frontend portfolio demonstration; it does not include a production backend, authentication, authorization, or real business integrations. Task changes persist in the current browser through `localStorage`.

## Suggested portfolio presentation

**Project title:** OpsPilot — Enterprise Operations Management Platform

**Short description:** A responsive enterprise operations dashboard featuring project tracking, task workflows, analytics, and a schema-driven dynamic form renderer built with React and TypeScript.

When presenting this project, describe the engineering decisions you actually made and be ready to explain the component structure, typed models, state flow, schema-driven rendering, accessibility, responsive layout, and performance trade-offs.
