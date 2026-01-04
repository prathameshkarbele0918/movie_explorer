import Link from "next/link";
import { Star } from "lucide-react";

interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_url: string;
  vote_average: number;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard = ({ movie }: MovieCardProps) => {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <Link href={`/movie/${movie.id}`} className="group block">
      <div className="overflow-hidden rounded-lg bg-card border border-border transition-all duration-200 hover:border-primary/50 hover:shadow-lg">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-card-foreground truncate">{movie.title}</h3>
          <div className="mt-1 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{releaseYear}</span>
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="font-medium text-card-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
