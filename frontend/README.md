# StudyAI Frontend

This is the frontend for the StudyAI application, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive design for all devices
- Authentication with JWT
- Note management with file uploads
- Flashcard creation and spaced repetition
- AI-powered summaries and question generation
- Daily review system

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:12000](http://localhost:12000) with your browser to see the result.

## Project Structure

- `src/app/(main)` - Main public pages (landing page, etc.)
- `src/app/(auth)` - Authentication pages (login, register)
- `src/app/(dashboard)` - Dashboard and authenticated pages
- `src/app/components` - Reusable UI components
- `src/app/hooks` - Custom React hooks and state management
- `src/app/services` - API services
- `src/app/types` - TypeScript type definitions

## Deployment

The frontend can be deployed to Vercel:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```
