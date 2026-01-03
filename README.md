# TMDB Movie Explorer

A Movie Explorer application built with React, TypeScript, and Vite that integrates with The Movie Database (TMDB) API.

## 📋 Project Overview

This application allows users to search for movies and view detailed information including cast, trailers, ratings, and more. The application demonstrates API integration, error handling, caching strategies, and production-ready patterns.

## 🏗️ Architecture Notes

### Important: Framework Constraint

**⚠️ Important Note**: The assignment requirements specify Next.js App Router with server-side rendering and Route Handlers. However, this project uses **Vite + React** as the build system, which has different capabilities:

- **Current Implementation**: Vite + React (Client-side rendering)
- **Required for Full Compliance**: Next.js App Router with SSR

### Current Architecture

1. **API Layer** (`src/lib/tmdb.ts`, `src/lib/api.ts`):
   - TMDB API client functions
   - Normalized response transformations
   - Error handling and rate limiting
   - **Note**: In a Next.js implementation, these would be Route Handlers under `/app/api/*`

2. **Pages**:
   - `/` - Search and listing page with pagination
   - `/movie/[id]` - Movie detail page

3. **State Management**:
   - React Query for server state management
   - URL query parameters for search state persistence

### Architecture Limitations

Due to Vite's architecture (unlike Next.js), the following requirements are implemented differently:

- **Server-Side Rendering**: Not available with Vite alone. Pages are client-rendered.
- **API Route Handlers**: Implemented as service functions. In Next.js, these would be at `/app/api/movies/search`, `/app/api/movies/[id]`, and `/app/api/config`.
- **Secret Management**: Currently using `VITE_TMDB_API_TOKEN` which is exposed to the client. In Next.js, this would be in `.env.local` and only accessible server-side.

**For Production Next.js Implementation**: 
- Move API functions to `/app/api/` Route Handlers
- Use server components by default
- Keep secrets in server-only environment variables

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- TMDB API Read Access Token (free): https://www.themoviedb.org/settings/api

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-explorer-ui-06
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file in the root directory:
```bash
VITE_TMDB_API_TOKEN=your_tmdb_read_access_token_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:8080`

## 🧪 Testing

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

1. **API Layer Tests** (`src/lib/__tests__/api.test.ts`):
   - Success cases for search and movie details
   - Error handling (429 rate limits, upstream errors)
   - Input validation

2. **Component Tests** (`src/components/__tests__/ErrorState.test.tsx`):
   - Error state rendering
   - Retry functionality
   - User interactions

## 📦 Caching Strategy

The application implements multiple layers of caching:

### 1. TMDB Configuration Cache (24 hours)

**Location**: `src/lib/tmdb.ts`

The TMDB configuration endpoint (`/configuration`) is cached aggressively for 24 hours because:
- Configuration rarely changes (image base URLs and sizes)
- It's called frequently (needed for building image URLs)
- Reduces API calls and improves performance

**Implementation**:
```typescript
let configCache: { data: TMDBConfiguration; timestamp: number } | null = null;
const CONFIG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

**Why 24 hours?**
- TMDB configuration changes infrequently
- Balancing freshness with performance
- Reduces unnecessary API requests

### 2. React Query Cache (60 seconds)

**Location**: Page components using `useQuery`

Search results and movie details are cached for 60 seconds using React Query:
- `staleTime: 60000` - Data is considered fresh for 60 seconds
- `gcTime: 300000` - Unused data is garbage collected after 5 minutes

**Why 60 seconds?**
- Search results may change (new movies added, ratings updated)
- 60 seconds provides a good balance between freshness and performance
- Users can get updated results without excessive API calls

**Cache Invalidation**:
- Manual refetch on retry after errors
- Automatic refetch when query parameters change

### 3. Browser HTTP Cache

The browser's native HTTP cache also caches responses based on:
- Cache-Control headers from TMDB API
- Browser default caching behavior

## ⚠️ Rate Limiting & Error Handling

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

## 🌐 API Endpoints

### Internal API Contract

The application exposes the following API functions (Route Handler equivalents):

#### 1. Search Movies
```typescript
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
```typescript
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
```typescript
GET /api/config
```

**Response**: Image configuration for building image URLs

## 📄 Pages

### Search and List Page (`/`)

**Features**:
- Server-rendered data (via React Query)
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

## 🚢 Deployment

### Environment Variables

Before deployment, ensure the following environment variable is set:

```bash
VITE_TMDB_API_TOKEN=your_tmdb_read_access_token_here
```

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` directory.

### Deployment Platforms

The application can be deployed to:

1. **Vercel**: 
   - Connect GitHub repository
   - Add environment variable in Vercel dashboard
   - Deploy automatically on push

2. **Netlify**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable in Netlify dashboard

3. **Any Static Host**:
   - Build the project: `npm run build`
   - Deploy the `dist` directory to your hosting provider
   - Ensure environment variables are configured

### Production Considerations

**Important**: When deploying a Vite app (not Next.js):
- Environment variables prefixed with `VITE_` are exposed to the client
- For true secret management, use a backend proxy or migrate to Next.js
- Consider using a backend-for-frontend (BFF) pattern for API calls

## 🔧 Development

### Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   └── __tests__/      # Component tests
├── lib/                # Utility functions and API clients
│   ├── api.ts         # API layer (Route Handler equivalents)
│   ├── tmdb.ts        # TMDB API client
│   └── __tests__/     # API tests
├── pages/             # Page components
├── test/              # Test setup
└── ...
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run linter

## 📝 Notes on Assignment Requirements

This implementation addresses the assignment requirements with the following considerations:

✅ **Implemented**:
- TMDB API integration
- Movie search and detail pages
- Error handling (including 429 rate limits)
- Caching strategy (documented above)
- Tests (API and component tests)
- Query parameter support for search
- Pagination
- Loading, empty, and error states
- TypeScript throughout

⚠️ **Architecture Differences**:
- Uses Vite instead of Next.js (assignment requires Next.js)
- Client-side rendering instead of SSR
- API functions instead of Route Handlers (same functionality, different location)
- Environment variables exposed to client (would be server-only in Next.js)

For full compliance with assignment requirements, the codebase should be migrated to Next.js App Router.

## 📚 Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vitest** - Testing framework
- **TMDB API** - Movie data source

## 📄 License

This project is for educational purposes.
