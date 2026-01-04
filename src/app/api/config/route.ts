import { NextResponse } from 'next/server';
import { getTMDBConfiguration } from '@/lib/tmdb';

export async function GET() {
  try {
    const config = await getTMDBConfiguration();
    return NextResponse.json(
      {
        images: {
          base_url: config.images.secure_base_url,
          poster_sizes: config.images.poster_sizes,
          backdrop_sizes: config.images.backdrop_sizes,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.statusCode || 500 }
    );
  }
}
