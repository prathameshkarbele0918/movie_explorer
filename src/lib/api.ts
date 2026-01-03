/**
 * Internal API Client
 * This wraps TMDB calls and provides normalized responses
 * In Next.js, these would be Route Handlers at /app/api/*
 */

import {
  searchMovies as tmdbSearch,
  getMovieDetails as tmdbGetDetails,
  getTMDBConfiguration,
  buildImageUrl,
  TMDBMovie,
  TMDBMovieDetail,
  TMDBError,
} from './tmdb';

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string;
  vote_average: number;
}

export interface MovieDetail {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string;
  backdrop_url: string;
  vote_average: number;
  genres: string[];
  runtime: number;
  cast: Array<{
    name: string;
    character: string;
    imageUrl: string;
  }>;
  trailers: Array<{
    id: string;
    key: string;
    title: string;
  }>;
}

export interface SearchResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
}

export interface ApiError {
  error: string;
  statusCode: number;
  retryAfter?: number;
}

/**
 * Normalize TMDB movie to our Movie format
 */
function normalizeMovie(movie: TMDBMovie, config?: any): Movie {
  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date || '',
    overview: movie.overview || '',
    poster_url: buildImageUrl(movie.poster_path, 'poster', config),
    vote_average: movie.vote_average,
  };
}

/**
 * Normalize TMDB movie detail to our MovieDetail format
 */
function normalizeMovieDetail(movie: TMDBMovieDetail, config?: any): MovieDetail {
  // Get top 5 cast members
  const topCast = (movie.credits?.cast || [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((actor) => ({
      name: actor.name,
      character: actor.character,
      imageUrl: buildImageUrl(actor.profile_path, 'profile', config),
    }));

  // Get YouTube trailers
  const trailers = (movie.videos?.results || [])
    .filter((video) => video.site === 'YouTube' && video.type === 'Trailer')
    .map((video) => ({
      id: video.id,
      key: video.key,
      title: video.name,
    }));

  return {
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date || '',
    overview: movie.overview || '',
    poster_url: buildImageUrl(movie.poster_path, 'poster', config),
    backdrop_url: buildImageUrl(movie.backdrop_path, 'backdrop', config),
    vote_average: movie.vote_average,
    genres: movie.genres?.map((g) => g.name) || [],
    runtime: movie.runtime || 0,
    cast: topCast,
    trailers,
  };
}

/**
 * Search movies
 * GET /api/movies/search?q=<string>&page=<number>
 */
export async function searchMoviesAPI(
  query: string,
  page: number = 1
): Promise<SearchResponse> {
  // Validation
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 2) {
    throw new Error('Query must be at least 2 characters long');
  }

  if (page < 1) {
    throw new Error('Page must be >= 1');
  }

  try {
    const config = await getTMDBConfiguration();
    const response = await tmdbSearch(trimmedQuery, page);
    
    return {
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results,
      results: response.results.map((movie) => normalizeMovie(movie, config)),
    };
  } catch (error: any) {
    if (error instanceof TMDBError && error.statusCode === 429) {
      const apiError: ApiError = {
        error: error.message,
        statusCode: 429,
      };
      throw apiError;
    }
    throw error;
  }
}

/**
 * Get movie details
 * GET /api/movies/{id}
 */
export async function getMovieDetailsAPI(id: number): Promise<MovieDetail> {
  if (!id || isNaN(id)) {
    throw new Error('Invalid movie ID');
  }

  try {
    const config = await getTMDBConfiguration();
    const movie = await tmdbGetDetails(id);
    return normalizeMovieDetail(movie, config);
  } catch (error: any) {
    if (error instanceof TMDBError && error.statusCode === 404) {
      throw new Error('Movie not found');
    }
    if (error instanceof TMDBError && error.statusCode === 429) {
      const apiError: ApiError = {
        error: error.message,
        statusCode: 429,
      };
      throw apiError;
    }
    throw error;
  }
}

/**
 * Get configuration
 * GET /api/config
 */
export async function getConfigAPI() {
  const config = await getTMDBConfiguration();
  return {
    images: {
      base_url: config.images.secure_base_url,
      poster_sizes: config.images.poster_sizes,
      backdrop_sizes: config.images.backdrop_sizes,
    },
  };
}

