import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import GenreTag from "@/components/GenreTag";
import CastCard from "@/components/CastCard";
import TrailerCard from "@/components/TrailerCard";
import ErrorState from "@/components/ErrorState";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import { getMovieDetailsAPI, type ApiError } from "@/lib/api";

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id ? parseInt(id, 10) : null;

  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["movie", "details", movieId],
    queryFn: () => {
      if (!movieId || isNaN(movieId)) {
        throw new Error("Invalid movie ID");
      }
      return getMovieDetailsAPI(movieId);
    },
    enabled: !!movieId && !isNaN(movieId),
    staleTime: 60000, // 60 seconds cache
    gcTime: 300000, // 5 minutes garbage collection
  });

  const getErrorMessage = (error: any): string => {
    if (error?.statusCode === 429) {
      return error.error || "Rate limit exceeded. Please try again later.";
    }
    if (error?.message?.includes("not found") || error?.statusCode === 404) {
      return "Movie not found";
    }
    return error?.message || "Something went wrong. Please try again.";
  };

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  // Set page metadata
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - Movie Explorer`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          movie.overview || `Details for ${movie.title}`
        );
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = movie.overview || `Details for ${movie.title}`;
        document.head.appendChild(meta);
      }
    }
    return () => {
      document.title = "Movie Explorer";
    };
  }, [movie]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <MovieCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <ErrorState message={getErrorMessage(error)} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {movie.backdrop_url && (
        <div className="relative h-[300px] sm:h-[400px] overflow-hidden">
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
      )}

      <div className={`container pb-12 ${movie.backdrop_url ? "-mt-32" : "pt-8"}`}>
        <Link to="/">
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
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              {movie.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-semibold text-foreground">
                  {movie.vote_average.toFixed(1)}
                </span>
              </div>
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              {releaseYear && (
                <span className="text-muted-foreground">{releaseYear}</span>
              )}
            </div>

            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <GenreTag key={genre} genre={genre} />
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
              {movie.cast.map((person, index) => (
                <CastCard
                  key={`${person.name}-${index}`}
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
              {movie.trailers.map((trailer) => (
                <TrailerCard
                  key={trailer.id}
                  title={trailer.title}
                  youtubeKey={trailer.key}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
