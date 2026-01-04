const BASE_URL = 'https://api.themoviedb.org/3';

function getToken() {
  const token = process.env.TMDB_API_TOKEN;
  if (!token) {
    throw new Error('TMDB_API_TOKEN is not set');
  }
  return token;
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

export class TMDBError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const token = getToken();
  const url = `${BASE_URL}${endpoint}`;
  
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After');
    throw new TMDBError(429, `Rate limit exceeded${retryAfter ? `. Retry after ${retryAfter} seconds` : ''}`);
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.status_message || msg;
    } catch {
      msg = `${res.status}: ${res.statusText}`;
    }
    throw new TMDBError(res.status, msg);
  }

  return res.json();
}

let configCache: TMDBConfiguration | null = null;
let cacheTime = 0;

export async function getTMDBConfiguration(): Promise<TMDBConfiguration> {
  const now = Date.now();
  if (configCache && (now - cacheTime) < 86400000) {
    return configCache;
  }

  const config = await fetchAPI<TMDBConfiguration>('/configuration');
  configCache = config;
  cacheTime = now;
  return config;
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  const params = new URLSearchParams({
    query: query.trim(),
    page: page.toString(),
    include_adult: 'false',
    language: 'en-US',
  });
  return fetchAPI<TMDBSearchResponse>(`/search/movie?${params.toString()}`);
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetail> {
  return fetchAPI<TMDBMovieDetail>(`/movie/${movieId}?append_to_response=videos,credits`);
}

export function buildImageUrl(path: string | null, size: 'poster' | 'backdrop' | 'profile' = 'poster', config?: TMDBConfiguration): string {
  if (!path) return '/placeholder.svg';

  if (!config) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  const base = config.images.secure_base_url;
  let imgSize = 'w500';
  
  if (size === 'backdrop') {
    imgSize = 'w1280';
  } else if (size === 'profile') {
    imgSize = 'w185';
  }

  return `${base}${imgSize}${path}`;
}
