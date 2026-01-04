# TMDB Movie Explorer

A Movie Explorer application built with Next.js App Router, TypeScript, and server-side rendering that integrates with The Movie Database (TMDB) API.

## Overview

This application allows users to search for movies and view detailed information including cast, trailers, ratings, and more. The application demonstrates Next.js App Router, server-side rendering, API integration, error handling, caching strategies, and production-ready patterns.

## Features

- Movie search with pagination
- Movie detail pages with cast, trailers, and metadata
- Server-side rendering (SSR) for all data-driven pages
- Route Handlers for TMDB API integration
- Proper error handling including rate limit detection
- Caching strategy for optimal performance
- TypeScript throughout
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- TMDB API Read Access Token (free): https://www.themoviedb.org/settings/api

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie_explorer
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```bash
TMDB_API_TOKEN=your_tmdb_read_access_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:3000`

## Testing

Run tests with:
```bash
npm test
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Coverage

The project includes:

1. **Route Handler Tests** (`src/app/api/movies/search/__tests__/route.test.ts`):
   - Success cases for search
   - Error handling (429 rate limits, upstream errors)
   - Input validation

2. **Component Tests** (`src/components/__tests__/ErrorState.test.tsx`):
   - Error state rendering
   - Retry functionality
   - User interactions

## Caching Strategy

The application implements multiple layers of caching:

### 1. TMDB Configuration Cache (24 hours)

**Location**: `src/lib/tmdb.ts`

The TMDB configuration endpoint (`/configuration`) is cached aggressively for 24 hours because:
- Configuration rarely changes (image base URLs and sizes)
- It's called frequently (needed for building image URLs)
- Reduces API calls and improves performance

**Implementation**: In-memory cache with 24-hour duration

### 2. Next.js Route Handler Caching

**Location**: Route Handlers in `src/app/api/*`

Search and movie details use Next.js caching:
- `revalidate: 60` - Data is revalidated every 60 seconds
- `Cache-Control` headers set appropriately
- Configuration endpoint cached for 24 hours

**Why 60 seconds?**
- Search results may change (new movies added, ratings updated)
- 60 seconds provides a good balance between freshness and performance
- Users can get updated results without excessive API calls

## Rate Limiting & Error Handling

### Rate Limit Detection (429)

The application detects and handles HTTP 429 (Too Many Requests) responses:

**Implementation**:
- Detects 429 status codes in API responses
- Extracts `Retry-After` header if available
- Returns structured error to the UI
- Shows user-friendly error message

**User Experience**:
- Clear error message displayed
- Retry button available
- Message includes retry timing if provided by API

### Error States Handled

1. **Rate Limiting (429)**: Shows retry message
2. **Not Found (404)**: Shows "Movie not found" for invalid IDs
3. **Network Errors**: Shows generic error with retry option
4. **API Errors**: Shows error message from API

## API Endpoints

### Internal API Contract

The application exposes the following Route Handlers:

#### 1. Search Movies
```
GET /api/movies/search?q=<string>&page=<number>
```

**Query Parameters**:
- `q` (required): Search query, min length 2, trimmed
- `page` (optional): Page number, must be >= 1, defaults to 1

**Response**:
```json
{
  "page": 1,
  "total_pages": 10,
  "total_results": 200,
  "results": [
    {
      "id": 123,
      "title": "Movie title",
      "release_date": "YYYY-MM-DD",
      "overview": "Overview text",
      "poster_url": "https://...",
      "vote_average": 7.5
    }
  ]
}
```

#### 2. Movie Details
```
GET /api/movies/{id}
```

**Response includes**:
- Core movie details (title, overview, release date)
- Genres
- Runtime
- Rating (vote_average)
- Top 5 cast members
- Trailers (YouTube keys)
- Poster and backdrop URLs

#### 3. Configuration
```
GET /api/config
```

**Response**: Image configuration for building image URLs

## Pages

### Search and List Page (`/`)

**Features**:
- Server-rendered data
- Reads from URL query parameters: `/?q=batman&page=1`
- Pagination support
- Loading state with skeletons
- Empty state when no results
- Error state with retry functionality

### Movie Detail Page (`/movie/[id]`)

**Features**:
- Server-rendered data
- Handles invalid IDs gracefully (404)
- Dynamic page metadata (title and description)
- Displays:
  - Movie poster and backdrop
  - Overview and metadata
  - Genres
  - Top 5 cast members
  - YouTube trailers (embedded)

## Deployment

### Environment Variables

Before deployment, ensure the following environment variable is set:

```bash
TMDB_API_TOKEN=your_tmdb_read_access_token_here
```

### Build for Production

```bash
npm run build
```

This creates an optimized production build.

### Deployment Platforms

The application can be deployed to:

1. **Vercel**: 
   - Connect GitHub repository
   - Add environment variable in Vercel dashboard
   - Deploy automatically on push

2. **Netlify**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Add environment variable in Netlify dashboard

### Production Considerations

- Environment variables are server-only (not exposed to client)
- All TMDB API calls are made server-side
- Proper caching headers set for optimal performance

## Build and Quality Gate

The following must pass:

- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Linting
- `npm run typecheck` - TypeScript type checking

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # Route Handlers
│   │   ├── movies/       # Movie API endpoints
│   │   └── config/       # Configuration endpoint
│   ├── movie/[id]/       # Movie detail page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Search page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── ui/              # UI components (button, input, skeleton)
│   └── __tests__/       # Component tests
├── lib/                 # Utility functions and API clients
│   ├── tmdb.ts         # TMDB API client
│   └── utils.ts        # Utility functions
└── test/               # Test setup
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run linter
- `npm run typecheck` - Type check TypeScript

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
- **TMDB API** - Movie data source

## Security

- TMDB API token is stored in `.env.local` and never exposed to the client
- All TMDB API calls are made server-side via Route Handlers
- No secrets in client-side code or browser network requests

## License

This project is for educational purposes.
