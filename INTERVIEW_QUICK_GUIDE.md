# Interview Quick Guide - TMDB Movie Explorer

## 🎯 Main Answer: "मैंने क्या बनाया?"

**"मैंने एक Movie Explorer Application बनाया है जो TMDB API से movies की जानकारी fetch करता है। यह Next.js App Router पर बना है, Server-Side Rendering use करता है, और सभी API calls server-side होती हैं।"**

---

## 📋 Quick File Overview (Interview में बोलने के लिए)

### **1. Pages (src/app/)**

#### `page.tsx` - Home/Search Page
- **काम**: Movie search और listing
- **Features**: URL से query read करता है, `/api/movies/search` call करता है, loading/empty/error states handle करता है
- **Type**: Server Component

#### `movie/[id]/page.tsx` - Movie Detail Page
- **काम**: Individual movie की details
- **Features**: Movie ID से details fetch करता है, cast/trailers/genres show करता है, dynamic metadata set करता है
- **Type**: Server Component

#### `SearchPageClient.tsx` - Search Input Logic
- **काम**: Search input का client-side handling
- **Features**: User input, URL sync, navigation
- **Type**: Client Component (user interaction के लिए)

---

### **2. API Routes (src/app/api/)**

#### `api/movies/search/route.ts`
- **काम**: Movie search API endpoint
- **Features**: Query validation, TMDB call, data normalization, caching (60s), error handling (429 rate limit)

#### `api/movies/[id]/route.ts`
- **काम**: Movie details API endpoint
- **Features**: ID validation, TMDB call, cast/trailers processing, caching (60s), 404 handling

#### `api/config/route.ts`
- **काम**: TMDB configuration endpoint
- **Features**: Image config return करता है, aggressive caching (24 hours)

---

### **3. Core Library (src/lib/)**

#### `tmdb.ts` - TMDB API Client
- **काम**: TMDB API के साथ communication
- **Key Functions**:
  - `getToken()` - Environment variable से token read
  - `fetchAPI()` - Generic API request, rate limit detection
  - `getTMDBConfiguration()` - Config fetch with 24h cache
  - `searchMovies()` - Movie search API call
  - `getMovieDetails()` - Movie details API call
  - `buildImageUrl()` - Image URLs construct करता है

#### `utils.ts`
- **काम**: Utility functions (className merge)

---

### **4. Components (src/components/)**

#### UI Components:
- `MovieCard.tsx` - Single movie card
- `MovieCardSkeleton.tsx` - Loading skeleton
- `Pagination.tsx` - Page navigation (Client Component)
- `SearchInput.tsx` - Search field (Client Component)
- `CastCard.tsx` - Cast member display
- `GenreTag.tsx` - Genre badge
- `TrailerCard.tsx` - YouTube trailer (Client Component)
- `ErrorState.tsx` - Error message
- `EmptyState.tsx` - Empty state

#### UI Library (shadcn/ui):
- `button.tsx`, `input.tsx`, `skeleton.tsx`

---

## 🏗️ Architecture Explanation

### **"Architecture क्या है?"**

1. **Server-Side Rendering (SSR)**
   - सभी pages server-side render होती हैं
   - Better SEO, faster initial load
   - Data fetching server-side

2. **Backend-for-Frontend (BFF) Pattern**
   - सभी TMDB API calls Route Handlers से होती हैं
   - Security: Token never exposed to client
   - Data transformation: TMDB response normalize करता है
   - Error handling centralized

3. **Caching Strategy**
   - Search/Details: 60 seconds (balance freshness और performance)
   - Configuration: 24 hours (rarely changes)

4. **Client Components Only Where Needed**
   - SearchInput, Pagination, TrailerCard - user interaction के लिए
   - बाकी सब Server Components

---

## 🔄 Data Flow (Interview में explain करने के लिए)

### **Search Flow:**
1. User types → `SearchInput` (Client)
2. URL update → `SearchPageClient` (Client)
3. Server reads URL → `page.tsx` (Server)
4. API call → `/api/movies/search` (Route Handler)
5. TMDB call → `tmdb.ts` → TMDB API
6. Response normalize → Route Handler
7. Page render → Results display

### **Detail Flow:**
1. User clicks movie → Link navigation
2. Server reads ID → `movie/[id]/page.tsx` (Server)
3. API call → `/api/movies/[id]` (Route Handler)
4. TMDB call → `tmdb.ts` → TMDB API
5. Data process → Cast/trailers filter
6. Page render → Movie details display

---

## ✅ Key Features (Interview में mention करने के लिए)

1. ✅ **Server-Side Rendering** - All pages SSR
2. ✅ **Route Handlers** - BFF layer for TMDB calls
3. ✅ **TypeScript** - Full type safety
4. ✅ **Error Handling** - Rate limits (429), 404, network errors
5. ✅ **Caching** - 60s for search/details, 24h for config
6. ✅ **Pagination** - URL-based pagination
7. ✅ **Loading States** - Skeleton loaders
8. ✅ **Empty/Error States** - User-friendly messages
9. ✅ **Dynamic Metadata** - SEO-friendly titles
10. ✅ **Testing** - Route Handler और component tests

---

## 🔒 Security Features

- ✅ No client-side TMDB API calls
- ✅ API token in `.env.local`, never exposed
- ✅ Input validation (query length, page number)
- ✅ Safe error messages

---

## 🧪 Testing

- **Route Handler Test**: Search API success/failure cases, rate limit handling
- **Component Test**: ErrorState component rendering और retry functionality

---

## 💡 Technical Decisions (Interview में explain करने के लिए)

### **"क्यों SSR use किया?"**
- Better SEO
- Faster initial page load
- No client-side API calls needed

### **"क्यों BFF Pattern use किया?"**
- Security: API token never exposed
- Data transformation: Normalize TMDB response
- Error handling: Centralized
- Caching control: Server-side caching

### **"Caching strategy क्या है?"**
- Search/Details: 60 seconds (balance between freshness और performance)
- Configuration: 24 hours (rarely changes, frequently needed)

### **"Client Components कहाँ use किए?"**
- Only where user interaction needed:
  - SearchInput (typing)
  - Pagination (button clicks)
  - TrailerCard (play/pause state)
  - SearchPageClient (URL sync)

---

## 🎤 Interview में बोलने का Flow

1. **Introduction**: "मैंने TMDB Movie Explorer बनाया है..."
2. **Architecture**: "Next.js App Router, SSR, BFF pattern..."
3. **Key Files**: "Main pages, API routes, TMDB client..."
4. **Features**: "Search, details, pagination, error handling..."
5. **Technical Decisions**: "Why SSR, why BFF, caching strategy..."
6. **Challenges**: "Rate limiting, data transformation, caching balance..."

---

## 📊 Project Stats (Quick Reference)

- **Pages**: 3 (home, detail, 404)
- **API Routes**: 3 (search, detail, config)
- **Components**: 9 main + 3 UI
- **Utilities**: 2 (TMDB client, utils)
- **Tests**: 2 (Route Handler, Component)
- **Total Files**: ~25+ (excluding config)

---

यह quick guide है interview के लिए। Detailed overview के लिए `PROJECT_OVERVIEW.md` देखें।

