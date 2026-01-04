# TMDB Movie Explorer - Complete Project Overview

## Interview के लिए Project Explanation

### Main Concept
यह एक **Movie Explorer Application** है जो TMDB (The Movie Database) API से movies की जानकारी fetch करता है। यह **Next.js App Router** पर बना है, **Server-Side Rendering (SSR)** use करता है, और सभी API calls **server-side** होती हैं।

---

## Project Structure & File-by-File Explanation

### 📁 Root Level Files

#### `package.json`
- **काम**: Dependencies और scripts define करता है
- **Key Dependencies**: Next.js 14, React 18, TypeScript, Tailwind CSS, Vitest
- **Scripts**: `dev`, `build`, `start`, `test`, `typecheck`, `lint`

#### `tsconfig.json`
- **काम**: TypeScript configuration
- **Features**: Path aliases (`@/*`), Next.js plugins, strict mode

#### `next.config.js`
- **काम**: Next.js configuration
- **Settings**: React strict mode enabled

#### `tailwind.config.ts`
- **काम**: Tailwind CSS configuration
- **Content paths**: `app` directory के सभी files

#### `vitest.config.ts`
- **काम**: Testing framework configuration
- **Environment**: JSDOM for React component testing

---

### 📁 `src/app/` - Next.js App Router (Main Application)

#### `layout.tsx` (Root Layout)
- **काम**: Application का root HTML structure
- **Features**:
  - Global metadata (title, description)
  - Global CSS import
  - HTML structure with `<html>` और `<body>`
- **Type**: Server Component (default)

#### `page.tsx` (Home/Search Page - Route: `/`)
- **काम**: Movie search और listing page
- **Features**:
  - **Server-Side Rendering**: URL से `searchParams` read करता है (`?q=batman&page=1`)
  - **Data Fetching**: `/api/movies/search` Route Handler को call करता है
  - **States Handle करता है**:
    - Loading state (skeleton loaders)
    - Empty state (no results)
    - Error state (with retry)
    - Initial state (search prompt)
  - **Pagination**: URL query parameters से page number manage करता है
- **Type**: Server Component (async function)
- **Caching**: `revalidate: 60` seconds

#### `SearchPageClient.tsx` (Client Component)
- **काम**: Search input का client-side logic
- **Features**:
  - Controlled input (React state)
  - URL sync (useSearchParams से query read करता है)
  - Navigation (router.push से URL update करता है)
  - Enter key support
- **Type**: Client Component (`"use client"`)
- **Why Client**: User interaction (input typing, button clicks)

#### `movie/[id]/page.tsx` (Movie Detail Page - Route: `/movie/[id]`)
- **काम**: Individual movie की detail page
- **Features**:
  - **Server-Side Rendering**: Dynamic route parameter से movie ID read करता है
  - **Data Fetching**: `/api/movies/[id]` Route Handler को call करता है
  - **Dynamic Metadata**: `generateMetadata` function से page title और description set करता है
  - **404 Handling**: Invalid ID पर `notFound()` call करता है
  - **Displays**:
    - Movie poster और backdrop
    - Title, overview, rating, runtime
    - Genres (tags)
    - Top 5 cast members
    - YouTube trailers (embedded)
- **Type**: Server Component (async function)
- **Caching**: `revalidate: 60` seconds

#### `not-found.tsx` (404 Page)
- **काम**: Custom 404 Not Found page
- **Features**: Back to search button, clean UI

#### `globals.css`
- **काम**: Global CSS styles
- **Content**: Tailwind CSS imports

---

### 📁 `src/app/api/` - Route Handlers (Backend-for-Frontend / BFF)

#### `api/movies/search/route.ts` (GET `/api/movies/search`)
- **काम**: Movie search API endpoint
- **Features**:
  - **Input Validation**:
    - `q` parameter: required, minimum 2 characters, trimmed
    - `page` parameter: must be >= 1
  - **TMDB API Call**: `searchMovies()` function call करता है
  - **Data Transformation**: TMDB response को normalize करता है
    - Poster URLs build करता है
    - Response shape standardize करता है
  - **Caching**: `Cache-Control: s-maxage=60` header set करता है
  - **Error Handling**:
    - 429 rate limit detect करता है
    - Structured error response return करता है
- **Type**: Route Handler (Next.js API route)
- **Security**: Server-side only, token never exposed

#### `api/movies/[id]/route.ts` (GET `/api/movies/{id}`)
- **काम**: Movie details API endpoint
- **Features**:
  - **Input Validation**: Movie ID must be valid number
  - **TMDB API Call**: `getMovieDetails()` function call करता है
  - **Data Processing**:
    - Top 5 cast members (sorted by order)
    - YouTube trailers filter करता है
    - Image URLs build करता है (poster, backdrop, profile)
    - Genres extract करता है
  - **Caching**: `Cache-Control: s-maxage=60` header
  - **Error Handling**:
    - 404 (movie not found)
    - 429 (rate limit)
    - Other errors
- **Type**: Route Handler (Dynamic route)

#### `api/config/route.ts` (GET `/api/config`)
- **काम**: TMDB configuration endpoint
- **Features**:
  - Image configuration return करता है
  - **Aggressive Caching**: 24 hours (`s-maxage=86400`)
  - **Why**: Configuration rarely changes, frequently needed
- **Type**: Route Handler

#### `api/movies/search/__tests__/route.test.ts`
- **काम**: Search Route Handler का unit test
- **Test Cases**:
  - Success case (valid query)
  - Validation errors (short query, invalid page)
  - Rate limit (429) handling
  - Upstream errors

---

### 📁 `src/lib/` - Utility Functions & API Client

#### `tmdb.ts` (TMDB API Client)
- **काम**: TMDB API के साथ communication का central point
- **Key Functions**:

  1. **`getToken()`**
     - Environment variable से TMDB token read करता है
     - Token missing होने पर error throw करता है

  2. **`fetchAPI<T>(endpoint)`**
     - Generic API request function
     - Authorization header add करता है
     - **Rate Limit Detection**: 429 status detect करता है
     - Error handling और parsing
     - TMDBError throw करता है

  3. **`getTMDBConfiguration()`**
     - TMDB configuration fetch करता है
     - **In-Memory Caching**: 24 hours cache (configCache variable)
     - Image base URLs और sizes return करता है

  4. **`searchMovies(query, page)`**
     - Movie search API call करता है
     - Query parameters build करता है
     - TMDBSearchResponse return करता है

  5. **`getMovieDetails(movieId)`**
     - Movie details API call करता है
     - `append_to_response=videos,credits` parameter add करता है
     - TMDBMovieDetail return करता है

  6. **`buildImageUrl(path, size, config)`**
     - Image URLs construct करता है
     - Size types: 'poster', 'backdrop', 'profile'
     - Fallback: placeholder.svg अगर path null है

- **Interfaces**:
  - `TMDBMovie`: Basic movie data structure
  - `TMDBMovieDetail`: Extended movie data (with videos, credits)
  - `TMDBConfiguration`: Image configuration structure
  - `TMDBSearchResponse`: Search API response structure
  - `TMDBError`: Custom error class with statusCode

#### `utils.ts`
- **काम**: Utility functions
- **Function**: `cn()` - className merge करने के लिए (clsx + tailwind-merge)

---

### 📁 `src/components/` - React Components

#### `MovieCard.tsx`
- **काम**: Single movie card display करता है
- **Features**:
  - Movie poster image
  - Title, release year, rating
  - Link to detail page (`/movie/[id]`)
  - Hover effects
- **Type**: Server Component (default)

#### `MovieCardSkeleton.tsx`
- **काम**: Loading state के लिए skeleton loader
- **Features**: Animated placeholder for movie cards
- **Used in**: Search page loading state

#### `Pagination.tsx`
- **काम**: Page navigation component
- **Features**:
  - Previous/Next buttons
  - Current page display
  - URL update करता है (useRouter, useSearchParams)
  - Disabled states (first/last page)
- **Type**: Client Component (`"use client"`)
- **Why Client**: User interaction (button clicks)

#### `SearchInput.tsx`
- **काम**: Search input field
- **Features**:
  - Search icon
  - Enter key support
  - Controlled input (value, onChange)
  - Search button
- **Type**: Client Component (`"use client"`)
- **Why Client**: User input handling

#### `CastCard.tsx`
- **काम**: Cast member display करता है
- **Features**: Profile image, name, character name
- **Used in**: Movie detail page

#### `GenreTag.tsx`
- **काम**: Genre badge/tag display करता है
- **Features**: Styled genre label
- **Used in**: Movie detail page

#### `TrailerCard.tsx`
- **काम**: YouTube trailer display करता है
- **Features**:
  - Thumbnail image
  - Click to play (iframe embed)
  - YouTube thumbnail fallback
  - Play button overlay
- **Type**: Client Component (`"use client"`)
- **Why Client**: State management (isPlaying), user interaction

#### `ErrorState.tsx`
- **काम**: Error message display करता है
- **Features**:
  - Error icon
  - Error message
  - Retry button (optional)
- **Used in**: Search page, detail page

#### `EmptyState.tsx`
- **काम**: Empty state display करता है
- **Features**: Film icon, message
- **Used in**: Search page (no results)

#### `components/ui/` - UI Components (shadcn/ui)

##### `button.tsx`
- **काम**: Reusable button component
- **Features**: Variants (default, outline, ghost, secondary), sizes

##### `input.tsx`
- **काम**: Reusable input component
- **Features**: Styled input field

##### `skeleton.tsx`
- **काम**: Loading skeleton component
- **Features**: Animated placeholder

#### `components/__tests__/ErrorState.test.tsx`
- **काम**: ErrorState component का unit test
- **Test Cases**: Rendering, error message, retry functionality

---

### 📁 `src/test/` - Test Setup

#### `setup.ts`
- **काम**: Vitest test setup
- **Features**: Jest DOM matchers import, cleanup

---

## Architecture & Design Decisions

### 1. **Server-Side Rendering (SSR)**
- **Why**: Better SEO, faster initial load, no client-side API calls
- **Implementation**: All pages are Server Components by default
- **Data Fetching**: Server-side `fetch()` calls with `revalidate`

### 2. **Backend-for-Frontend (BFF) Pattern**
- **Why**: 
  - Security (API token never exposed to client)
  - Data transformation (normalize TMDB response)
  - Error handling centralization
  - Caching control
- **Implementation**: Route Handlers in `/app/api/*`

### 3. **Caching Strategy**
- **Search/Details**: 60 seconds revalidation
  - **Why**: Balance between freshness and performance
- **Configuration**: 24 hours (in-memory + HTTP cache)
  - **Why**: Rarely changes, frequently needed

### 4. **Error Handling**
- **Rate Limiting (429)**: Detected and handled gracefully
- **404**: Movie not found handled
- **Network Errors**: User-friendly messages
- **Structured Errors**: Consistent error response format

### 5. **TypeScript**
- **Why**: Type safety, better developer experience
- **Usage**: All files are TypeScript, strict mode enabled

### 6. **Client Components Only Where Needed**
- **SearchInput**: User input handling
- **Pagination**: URL navigation
- **TrailerCard**: State management (play/pause)
- **SearchPageClient**: URL sync with search params

---

## Data Flow

### Search Flow:
1. User types in `SearchInput` (Client Component)
2. `SearchPageClient` updates URL via router
3. `page.tsx` (Server Component) reads `searchParams` from URL
4. Calls `/api/movies/search` Route Handler
5. Route Handler calls `searchMovies()` from `tmdb.ts`
6. `tmdb.ts` makes request to TMDB API
7. Response normalized and returned
8. Page renders with results

### Detail Flow:
1. User clicks `MovieCard` link
2. `movie/[id]/page.tsx` (Server Component) reads `id` from params
3. Calls `/api/movies/[id]` Route Handler
4. Route Handler calls `getMovieDetails()` from `tmdb.ts`
5. `tmdb.ts` makes request to TMDB API
6. Response processed (cast, trailers filtered)
7. Page renders with movie details

---

## Key Features Implemented

✅ **Server-Side Rendering** - All pages SSR
✅ **Route Handlers** - BFF layer for all TMDB calls
✅ **TypeScript** - Full type safety
✅ **Error Handling** - Rate limits, 404, network errors
✅ **Caching** - 60s for search/details, 24h for config
✅ **Pagination** - URL-based pagination
✅ **Loading States** - Skeleton loaders
✅ **Empty States** - No results handling
✅ **Error States** - User-friendly error messages
✅ **Dynamic Metadata** - SEO-friendly page titles
✅ **Responsive Design** - Mobile-friendly UI
✅ **Testing** - Route Handler and component tests

---

## Security Features

✅ **No Client-Side API Calls** - All TMDB calls server-side
✅ **Token Security** - API token in `.env.local`, never exposed
✅ **Input Validation** - Query length, page number validation
✅ **Error Sanitization** - Safe error messages to client

---

## Interview में क्या बोलना है:

### "मैंने क्या बनाया?"
"मैंने एक **TMDB Movie Explorer Application** बनाया है जो Next.js App Router पर बना है। यह users को movies search करने और details देखने की facility देता है।"

### "Architecture क्या है?"
"मैंने **Server-Side Rendering** use किया है, सभी pages server-side render होती हैं। TMDB API calls के लिए मैंने **Backend-for-Frontend (BFF) pattern** use किया है - सभी API calls Route Handlers से होती हैं, client-side से direct TMDB API call नहीं होती।"

### "Key Features क्या हैं?"
1. **Movie Search** - Query-based search with pagination
2. **Movie Details** - Cast, trailers, genres, ratings
3. **SSR** - All pages server-rendered
4. **Caching** - 60 seconds for search/details, 24 hours for config
5. **Error Handling** - Rate limits, 404, network errors
6. **TypeScript** - Full type safety
7. **Testing** - Unit tests for Route Handlers and components

### "Technical Decisions क्यों लिए?"
- **SSR**: Better SEO, faster initial load
- **BFF Pattern**: Security (token never exposed), data transformation
- **Caching**: Performance optimization, reduce API calls
- **TypeScript**: Type safety, better developer experience
- **Client Components Only Where Needed**: Better performance, smaller bundle

### "Challenges क्या आए?"
1. **Rate Limiting**: 429 errors handle करने के लिए proper error handling implement किया
2. **Caching Strategy**: Balance between freshness और performance
3. **Data Transformation**: TMDB response को normalize करना
4. **URL-based Pagination**: Server-side pagination with URL sync

---

## File Count Summary

- **Pages**: 3 (home, detail, 404)
- **Route Handlers**: 3 (search, detail, config)
- **Components**: 9 (UI components)
- **Utilities**: 2 (TMDB client, utils)
- **Tests**: 2 (Route Handler, Component)
- **Config Files**: 5 (TypeScript, Tailwind, Next.js, Vitest, PostCSS)

**Total**: ~25+ files (excluding node_modules, config files)

---

यह complete overview है। Interview में आप confidently explain कर सकते हैं कि कौन सी file क्या कर रही है और क्यों।

