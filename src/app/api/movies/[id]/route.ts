import { NextRequest, NextResponse } from 'next/server';
import { getMovieDetails, getTMDBConfiguration, buildImageUrl, TMDBMovieDetail, TMDBError } from '@/lib/tmdb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    const config = await getTMDBConfiguration();
    const movie = await getMovieDetails(id);

    const cast = (movie.credits?.cast || [])
      .sort((a, b) => a.order - b.order)
      .slice(0, 5)
      .map(a => ({
        name: a.name,
        character: a.character,
        imageUrl: buildImageUrl(a.profile_path, 'profile', config),
      }));

    const trailers = (movie.videos?.results || [])
      .filter(v => v.site === 'YouTube' && v.type === 'Trailer')
      .map(v => ({
        id: v.id,
        key: v.key,
        title: v.name,
      }));

    return NextResponse.json(
      {
        id: movie.id,
        title: movie.title,
        release_date: movie.release_date || '',
        overview: movie.overview || '',
        poster_url: buildImageUrl(movie.poster_path, 'poster', config),
        backdrop_url: buildImageUrl(movie.backdrop_path, 'backdrop', config),
        vote_average: movie.vote_average,
        genres: movie.genres?.map(g => g.name) || [],
        runtime: movie.runtime || 0,
        cast,
        trailers,
      },
      {
        headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
      }
    );
  } catch (e: any) {
    if (e instanceof TMDBError && e.statusCode === 404) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    if (e instanceof TMDBError && e.statusCode === 429) {
      return NextResponse.json({ error: e.message, statusCode: 429 }, { status: 429 });
    }
    return NextResponse.json(
      { error: e.message || 'Internal server error' },
      { status: e.statusCode || 500 }
    );
  }
}
