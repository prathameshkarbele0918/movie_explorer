/**
 * TMDB API Client
 * This service handles all TMDB API calls server-side
 * Note: In a production Next.js app, this would be in Route Handlers
 */

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_TOKEN = import.meta.env.VITE_TMDB_API_TOKEN;

if (!TMDB_API_TOKEN) {
  console.warn('VITE_TMDB_API_TOKEN is not set. API calls will fail.');
}

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  genre_ids?: number[];
}

export interface TMDBMovieDetail extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
  credits?: {
    cast: Array<{
      id: number;
      name: string;
      character: string;
      profile_path: string | null;
      order: number;
    }>;
  };
}

export interface TMDBConfiguration {
  images: {
    base_url: string;
    secure_base_url: string;
    backdrop_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
  };
}

export interface TMDBSearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TMDBMovie[];
}

export interface TMDBErrorResponse {
  status_message: string;
  status_code: number;
}

export class TMDBError extends Error {
  statusCode: number;
  
  constructor(
    statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'TMDBError';
    this.statusCode = statusCode;
  }
}

/**
 * Makes a request to TMDB API
 */
async function tmdbRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!TMDB_API_TOKEN) {
    throw new TMDBError(500, 'TMDB API token is not configured');
  }

  const url = `${TMDB_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${TMDB_API_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Handle rate limiting (429)
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new TMDBError(
      429,
      `Rate limit exceeded. ${retryAfter ? `Retry after ${retryAfter} seconds.` : 'Please try again later.'}`
    );
  }

  if (!response.ok) {
    const error: TMDBErrorResponse = await response.json().catch(() => ({
      status_message: `HTTP ${response.status}: ${response.statusText}`,
      status_code: response.status,
    }));
    throw new TMDBError(response.status, error.status_message);
  }

  return response.json();
}

/**
 * Get TMDB configuration (for image URLs)
 * This should be cached aggressively (24 hours)
 */
let configCache: { data: TMDBConfiguration; timestamp: number } | null = null;
const CONFIG_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getTMDBConfiguration(): Promise<TMDBConfiguration> {
  const now = Date.now();
  
  // Return cached config if still valid
  if (configCache && (now - configCache.timestamp) < CONFIG_CACHE_DURATION) {
    return configCache.data;
  }

  const config = await tmdbRequest<TMDBConfiguration>('/configuration');
  configCache = { data: config, timestamp: now };
  return config;
}

/**
 * Search movies
 */
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    query: query.trim(),
    page: page.toString(),
    include_adult: 'false',
    language: 'en-US',
  });

  return tmdbRequest<TMDBSearchResponse>(`/search/movie?${params.toString()}`);
}

/**
 * Get movie details with videos and credits
 */
export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetail> {
  return tmdbRequest<TMDBMovieDetail>(
    `/movie/${movieId}?append_to_response=videos,credits`
  );
}

/**
 * Build full image URL from TMDB path
 */
export function buildImageUrl(
  path: string | null,
  size: 'poster' | 'backdrop' | 'profile' = 'poster',
  config?: TMDBConfiguration
): string {
  if (!path) {
    return '/placeholder.svg';
  }

  if (!config) {
    // Fallback if config not loaded
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  const baseUrl = config.images.secure_base_url;
  const sizes = config.images[`${size}_sizes` as keyof typeof config.images] as string[];
  const sizeKey = size === 'poster' ? 'w500' : size === 'backdrop' ? 'w1280' : 'w185';
  
  // Use the appropriate size if available, otherwise use the first size
  const imageSize = sizes.includes(sizeKey) ? sizeKey : sizes[0] || 'w500';
  
  return `${baseUrl}${imageSize}${path}`;
}

