# Frontend (Next.js)

This is the frontend application built with Next.js 16, React 19, and TypeScript.

## Project Structure

```
frontend/
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Utilities and API client
├── public/           # Static assets
├── hooks/            # React hooks
├── types/            # TypeScript type definitions
└── styles/           # Global styles
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## API Communication

All backend communication goes through `/lib/api-client.ts`.

**Never make direct database calls or business logic in the frontend!**

## Architecture

- **Frontend**: UI/UX only
- **Backend**: All business logic (see `/backend` folder)
- **Communication**: HTTP/REST API calls to FastAPI backend

See `../ARCHITECTURE.md` for complete architecture documentation.

## Key Files

- `lib/api-client.ts` - API client for backend communication
- `app/page.tsx` - Home page
- `app/candidates/[id]/page.tsx` - Candidate dashboard
- `components/candidate-application-form.tsx` - Main application form

