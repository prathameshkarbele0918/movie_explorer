import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '../route';
import { NextRequest } from 'next/server';
import * as tmdb from '@/lib/tmdb';

vi.mock('@/lib/tmdb', () => ({
  searchMovies: vi.fn(),
  getTMDBConfiguration: vi.fn(),
  buildImageUrl: vi.fn((path) => `https://image.tmdb.org/t/p/w500${path}`),
}));

describe('GET /api/movies/search', () => {
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

    const request = new NextRequest('http://localhost:3000/api/movies/search?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page).toBe(1);
    expect(data.total_pages).toBe(5);
    expect(data.results).toHaveLength(1);
    expect(data.results[0].title).toBe('Test Movie');
    expect(tmdb.searchMovies).toHaveBeenCalledWith('test', 1);
  });

  it('should reject query shorter than 2 characters', async () => {
    const request = new NextRequest('http://localhost:3000/api/movies/search?q=a&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('at least 2 characters');
  });

  it('should reject page less than 1', async () => {
    const request = new NextRequest('http://localhost:3000/api/movies/search?q=test&page=0');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Page must be >= 1');
  });

  it('should handle 429 rate limit error', async () => {
    const rateLimitError = new Error('Rate limit exceeded');
    (rateLimitError as any).statusCode = 429;
    (rateLimitError as any).message = 'Rate limit exceeded. Retry after 60 seconds.';

    vi.mocked(tmdb.searchMovies).mockRejectedValue(rateLimitError);

    const request = new NextRequest('http://localhost:3000/api/movies/search?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.statusCode).toBe(429);
    expect(data.error).toContain('Rate limit exceeded');
  });

  it('should handle upstream API errors', async () => {
    const apiError = new Error('Upstream API error');
    (apiError as any).statusCode = 500;

    vi.mocked(tmdb.searchMovies).mockRejectedValue(apiError);

    const request = new NextRequest('http://localhost:3000/api/movies/search?q=test&page=1');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Upstream API error');
  });
});





