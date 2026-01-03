"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Film } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import MovieCard from "@/components/MovieCard";
import MovieCardSkeleton from "@/components/MovieCardSkeleton";
import Pagination from "@/components/Pagination";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import { searchMoviesAPI, type ApiError } from "@/lib/api";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const queryParam = searchParams.get("q") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const currentPage = pageParam >= 1 ? pageParam : 1;
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [submittedQuery, setSubmittedQuery] = useState(queryParam);

  // Sync URL params with state
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setSearchQuery(urlQuery);
    setSubmittedQuery(urlQuery);
  }, [searchParams]);

  const {
    data: searchData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["movies", "search", submittedQuery, currentPage],
    queryFn: () => {
      if (!submittedQuery.trim() || submittedQuery.trim().length < 2) {
        return null;
      }
      return searchMoviesAPI(submittedQuery.trim(), currentPage);
    },
    enabled: submittedQuery.trim().length >= 2,
    staleTime: 60000, // 60 seconds cache
    gcTime: 300000, // 5 minutes garbage collection
  });

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      return;
    }
    setSubmittedQuery(trimmed);
    navigate(`/?q=${encodeURIComponent(trimmed)}&page=1`);
  };

  const handlePageChange = (page: number) => {
    if (submittedQuery) {
      navigate(`/?q=${encodeURIComponent(submittedQuery)}&page=${page}`);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const getErrorMessage = (error: any): string => {
    if (error?.statusCode === 429) {
      return error.error || "Rate limit exceeded. Please try again later.";
    }
    return error?.message || "Something went wrong. Please try again.";
  };

  // Determine view state
  const hasSearched = submittedQuery.trim().length >= 2;
  const hasResults = searchData && searchData.results.length > 0;
  const isEmpty = hasSearched && searchData && searchData.results.length === 0;
  const isError = !!error;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-3 mb-6">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-card-foreground">Movie Explorer</h1>
          </div>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
          />
        </div>
      </header>

      <main className="container py-8">
        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <ErrorState message={getErrorMessage(error)} onRetry={handleRetry} />
        )}

        {isEmpty && (
          <EmptyState message={`No movies found for "${submittedQuery}"`} />
        )}

        {!isLoading && !isError && hasResults && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {searchData!.results.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {searchData!.total_pages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={searchData!.total_pages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {!hasSearched && !isLoading && !isError && (
          <div className="flex flex-col items-center justify-center py-16">
            <Film className="h-16 w-16 mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              Search for movies to get started
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
