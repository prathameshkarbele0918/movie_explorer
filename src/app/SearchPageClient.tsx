"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import SearchInput from "@/components/SearchInput";

interface SearchPageClientProps {
  initialQuery: string;
}

export default function SearchPageClient({ initialQuery }: SearchPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setSearchQuery(urlQuery);
  }, [searchParams]);

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return;
    router.push(`/?q=${encodeURIComponent(trimmed)}&page=1`);
  };

  return (
    <SearchInput
      value={searchQuery}
      onChange={setSearchQuery}
      onSearch={handleSearch}
    />
  );
}
