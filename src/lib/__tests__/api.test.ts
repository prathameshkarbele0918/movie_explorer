/**
 * Route Handler Tests (API Layer Tests)
 * These tests validate the API functions that would be Route Handlers in Next.js
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchMoviesAPI,
  getMovieDetailsAPI,
  type ApiError,
} from '../api';
import * as tmdb from '../tmdb';

// Mock the TMDB module
vi.mock('../tmdb', () => ({
  searchMovies: vi.fn(),
  getMovieDetails: vi.fn(),
  getTMDBConfiguration: vi.fn(),
  buildImageUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
}));

describe('API Layer - Route Handler Equivalents', () => {
  const mockConfig = {
    images: {
      secure_base_url: 'https://image.tmdb.org/t/p/',
      poster_sizes: ['w500', 'w780'],
      backdrop_sizes: ['w1280'],
      profile_sizes: ['w185'],
    },
  };

  beforeEach(() => {
    vi.mocked(tmdb.getTMDBConfiguration).mockResolvedValue(mockConfig as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('searchMoviesAPI', () => {
    it('should successfully search movies with valid query and page', async () => {
      const mockResponse = {
        page: 1,
        total_pages: 5,
        total_results: 100,
        results: [
          {
            id: 123,
            title: 'Test Movie',
            release_date: '2023-01-01',
            overview: 'Test overview',
            poster_path: '/poster.jpg',
            backdrop_path: '/backdrop.jpg',
            vote_average: 8.5,
          },
        ],
      };

      vi.mocked(tmdb.searchMovies).mockResolvedValue(mockResponse);

      const result = await searchMoviesAPI('test', 1);

      expect(result).toEqual({
        page: 1,
        total_pages: 5,
        total_results: 100,
        results: [
          {
            id: 123,
            title: 'Test Movie',
            release_date: '2023-01-01',
            overview: 'Test overview',
            poster_url: 'https://image.tmdb.org/t/p/w500/poster.jpg',
            vote_average: 8.5,
          },
        ],
      });

      expect(tmdb.searchMovies).toHaveBeenCalledWith('test', 1);
    });

    it('should reject query shorter than 2 characters', async () => {
      await expect(searchMoviesAPI('a', 1)).rejects.toThrow(
        'Query must be at least 2 characters long'
      );
    });

    it('should reject page less than 1', async () => {
      await expect(searchMoviesAPI('test', 0)).rejects.toThrow(
        'Page must be >= 1'
      );
    });

    it('should handle 429 rate limit error', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).statusCode = 429;
      (rateLimitError as any).message = 'Rate limit exceeded. Retry after 60 seconds.';

      vi.mocked(tmdb.searchMovies).mockRejectedValue(rateLimitError);

      try {
        await searchMoviesAPI('test', 1);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(429);
        expect(error.error).toContain('Rate limit exceeded');
      }
    });

    it('should handle upstream API errors', async () => {
      const apiError = new Error('Upstream API error');
      (apiError as any).statusCode = 500;

      vi.mocked(tmdb.searchMovies).mockRejectedValue(apiError);

      await expect(searchMoviesAPI('test', 1)).rejects.toThrow('Upstream API error');
    });
  });

  describe('getMovieDetailsAPI', () => {
    it('should successfully get movie details', async () => {
      const mockMovie = {
        id: 123,
        title: 'Test Movie',
        release_date: '2023-01-01',
        overview: 'Test overview',
        poster_path: '/poster.jpg',
        backdrop_path: '/backdrop.jpg',
        vote_average: 8.5,
        genres: [{ id: 1, name: 'Action' }],
        runtime: 120,
        videos: {
          results: [
            {
              id: 'video1',
              key: 'abc123',
              name: 'Trailer 1',
              site: 'YouTube',
              type: 'Trailer',
            },
          ],
        },
        credits: {
          cast: [
            {
              id: 1,
              name: 'Actor 1',
              character: 'Character 1',
              profile_path: '/actor1.jpg',
              order: 0,
            },
            {
              id: 2,
              name: 'Actor 2',
              character: 'Character 2',
              profile_path: '/actor2.jpg',
              order: 1,
            },
          ],
        },
      };

      vi.mocked(tmdb.getMovieDetails).mockResolvedValue(mockMovie as any);

      const result = await getMovieDetailsAPI(123);

      expect(result.id).toBe(123);
      expect(result.title).toBe('Test Movie');
      expect(result.genres).toEqual(['Action']);
      expect(result.runtime).toBe(120);
      expect(result.cast).toHaveLength(2);
      expect(result.trailers).toHaveLength(1);
      expect(result.trailers[0].key).toBe('abc123');
    });

    it('should reject invalid movie ID', async () => {
      await expect(getMovieDetailsAPI(NaN)).rejects.toThrow('Invalid movie ID');
    });

    it('should handle 404 not found error', async () => {
      const notFoundError = new Error('Movie not found');
      (notFoundError as any).statusCode = 404;

      vi.mocked(tmdb.getMovieDetails).mockRejectedValue(notFoundError);

      await expect(getMovieDetailsAPI(999)).rejects.toThrow('Movie not found');
    });

    it('should handle 429 rate limit error', async () => {
      const rateLimitError = new Error('Rate limit exceeded');
      (rateLimitError as any).statusCode = 429;
      (rateLimitError as any).message = 'Rate limit exceeded. Retry after 60 seconds.';

      vi.mocked(tmdb.getMovieDetails).mockRejectedValue(rateLimitError);

      try {
        await getMovieDetailsAPI(123);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.statusCode).toBe(429);
        expect(error.error).toContain('Rate limit exceeded');
      }
    });
  });
});

