import { Suspense } from "react";
import { Film } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SearchPageClient from "./SearchPageClient";

interface SearchPageProps {
  searchParams: { q?: string; page?: string };
}

async function getSearchResults(q: string, page: number) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/movies/search?q=${encodeURIComponent(q)}&page=${page}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to fetch');
  }
  
  return res.json();
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const q = searchParams.q?.trim() || "";
  const page = parseInt(searchParams.page || "1", 10);
  const currentPage = page > 0 ? page : 1;

  let data = null;
  let error = null;

  if (q.length >= 2) {
    try {
      data = await getSearchResults(q, currentPage);
    } catch (e: any) {
      error = e.message || "Something went wrong";
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-6">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-card-foreground">Movie Explorer</h1>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SearchPageClient initialQuery={q} />
          </Suspense>
        </div>
      </header>

      <main className="container py-8">
        {error && <ErrorState message={error} />}

        {!error && q.length >= 2 && !data && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!error && q.length >= 2 && data && data.results.length === 0 && (
          <EmptyState message={`No movies found for "${q}"`} />
        )}

        {!error && data && data.results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {data.results.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {data.total_pages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={currentPage} totalPages={data.total_pages} />
              </div>
            )}
          </>
        )}

        {q.length < 2 && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <Film className="h-16 w-16 mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">Search for movies to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
