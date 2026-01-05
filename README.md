



- **Git Repository**: https://github.com/prathameshkarbele0918/movie_explorer
- **Live Demo**: https://movie-explorer-ui-06.vercel.app/



## Features

- Search movies with pagination
- Detailed movie pages with cast info and trailers
- Server-side rendering for fast page loads
- Handles rate limits gracefully (shows you when to retry)
- Smart caching to reduce API calls
- Fully typed with TypeScript
- Works great on mobile and desktop


Here's how to set it up:

1. Clone the repo:
```bash
git clone https://github.com/prathameshkarbele0918/movie_explorer.git
cd movie_explorer
```

2. Install the dependencies:

npm install


3. Copy `.env.example` to `.env.local` and add your TMDB API token:



Then edit `.env.local` and add your token:
```
TMDB_API_TOKEN=your_token_here
```

4. Run the dev server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser

## Environment Variables

You need to set up these environment variables:

**Required:**
- `TMDB_API_TOKEN` - Your TMDB API token (get it from their website)

**Optional:**
- `NEXT_PUBLIC_BASE_URL` - Your app's URL (only needed for production)

Check out `.env.example` for the format. Just copy it to `.env.local` and fill in your token.

## Running Tests

To run the tests:
```bash
npm test
```

For a visual test UI:
```bash
npm run test:ui
```

To see test coverage:
```bash
npm run test:coverage
```

I've added tests for:
- API route handlers (search functionality, error handling, rate limits)
- Error state component (making sure retry buttons work, etc.)




**Search and Movie Details (60 second revalidation)**
For search results and movie details, I use Next.js's built-in caching with a 60 second revalidation time. This means:
- Data stays fresh (updates every minute)
- But we're not hammering the API on every request
- Users get recent results without waiting forever

I picked 60 seconds because movie data can change (new releases, rating updates), but not so frequently that we need to check every second. It's a good balance.

## Error Handling

The app handles errors pretty gracefully. If you hit a rate limit (429), it'll tell you and show when you can retry. I also check for the `Retry-After` header from TMDB so users know exactly when to try again.

Other errors handled:
- 404s for movies that don't exist
- Network issues with a retry option
- Any other API errors get shown to the user in a friendly way

## API Routes

The app has a few internal API routes:

**`GET /api/movies/search?q=<query>&page=<page>`**
- Search for movies (query needs to be at least 2 characters)
- Returns paginated results with movie info

**`GET /api/movies/[id]`**
- Get full details for a specific movie
- Includes cast, trailers, genres, runtime, etc.

**`GET /api/config`**
- Returns image configuration for building poster/backdrop URLs

## Pages

**Homepage (`/`)** - The search page where you can look up movies. It reads from URL params so you can share search links. Has pagination, loading states, and handles empty/error states.

**Movie Detail (`/movie/[id]`)** - Shows everything about a movie - poster, backdrop, overview, genres, top 5 cast members, and embedded YouTube trailers. If the movie doesn't exist, it shows a 404 page.

## Deployment

### Environment Variables

Before deployment, ensure the following environment variable is set:

```bash
TMDB_API_TOKEN=your_tmdb_read_access_token_here
```

## How to Build

Build the application for production:

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

To start the production server after building:

```bash
npm run start
```

### Deployment Platforms

1. **Vercel**: 
   - Connect GitHub repository
   - Add environment variable in Vercel dashboard
   - Deploy automatically on push


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

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vitest** - Testing framework
- **TMDB API** - Movie data source




