import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenreTag from "@/components/GenreTag";
import CastCard from "@/components/CastCard";
import TrailerCard from "@/components/TrailerCard";
import ErrorState from "@/components/ErrorState";
import type { Metadata } from "next";

interface MovieDetailPageProps {
  params: { id: string };
}

async function getMovie(id: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/movies/${id}`;
  const res = await fetch(url, { next: { revalidate: 60 } });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch');
  }

  return res.json();
}

export async function generateMetadata({ params }: MovieDetailPageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  
  if (isNaN(id)) {
    return { title: "Movie Not Found - Movie Explorer" };
  }

  try {
    const movie = await getMovie(id);
    if (!movie) {
      return { title: "Movie Not Found - Movie Explorer" };
    }
    return {
      title: `${movie.title} - Movie Explorer`,
      description: movie.overview || `Details for ${movie.title}`,
    };
  } catch {
    return { title: "Movie Explorer" };
  }
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const id = parseInt(params.id, 10);

  if (isNaN(id)) {
    notFound();
  }

  let movie = null;
  let error = null;

  try {
    movie = await getMovie(id);
    if (!movie) {
      notFound();
    }
  } catch (e: any) {
    error = e.message || "Failed to load";
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <ErrorState message={error} />
        </div>
      </div>
    );
  }

  if (!movie) {
    notFound();
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return (
    <div className="min-h-screen bg-background">
      {movie.backdrop_url && (
        <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
          <img src={movie.backdrop_url} alt={movie.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className={`container pb-12 ${movie.backdrop_url ? "-mt-32" : "pt-8"}`}>
        <Link href="/">
          <Button variant="secondary" size="sm" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="flex flex-col gap-8 sm:flex-row">
          <div className="shrink-0">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-48 rounded-lg shadow-lg border border-border"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">{movie.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold text-foreground">{movie.vote_average.toFixed(1)}</span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {year && <span className="text-muted-foreground">{year}</span>}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((g: string) => (
                  <GenreTag key={g} genre={g} />
                ))}
              </div>
            )}

            {movie.overview && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-foreground mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
              </div>
            )}
          </div>
        </div>

        {movie.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Top Cast</h2>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-5">
              {movie.cast.map((person: any, i: number) => (
                <CastCard
                  key={i}
                  name={person.name}
                  character={person.character}
                  imageUrl={person.imageUrl}
                />
              ))}
            </div>
          </section>
        )}

        {movie.trailers.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Trailers</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {movie.trailers.map((t: any) => (
                <TrailerCard key={t.id} title={t.title} youtubeKey={t.key} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
