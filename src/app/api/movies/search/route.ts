import { NextRequest, NextResponse } from 'next/server';
import { searchMovies, getTMDBConfiguration, buildImageUrl, TMDBMovie, TMDBError } from '@/lib/tmdb';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const q = params.get('q');
  const pageStr = params.get('page');

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
  }

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  if (isNaN(page) || page < 1) {
    return NextResponse.json({ error: 'Page must be >= 1' }, { status: 400 });
  }

  try {
    const config = await getTMDBConfiguration();
    const response = await searchMovies(q.trim(), page);
    
    const results = response.results.map((m: TMDBMovie) => ({
      id: m.id,
      title: m.title,
      release_date: m.release_date || '',
      overview: m.overview || '',
      poster_url: buildImageUrl(m.poster_path, 'poster', config),
      vote_average: m.vote_average,
    }));

    return NextResponse.json(
      {
        page: response.page,
        total_pages: response.total_pages,
        total_results: response.total_results,
        results,
      },
      {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      }
    );
  } catch (e: any) {
    if (e instanceof TMDBError && e.statusCode === 429) {
      return NextResponse.json({ error: e.message, statusCode: 429 }, { status: 429 });
    }
    return NextResponse.json(
      { error: e.message || 'Internal server error' },
      { status: e.statusCode || 500 }
    );
  }
}
