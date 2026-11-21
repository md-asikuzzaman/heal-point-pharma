"use client";

import { Input } from "@/components/ui/input";
import { productService } from "@/services/product.service";
import { useDebounce } from "@/hooks/use-debounce";

import { Search, Clock, TrendingUp, PackageX } from "lucide-react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Product } from "@prisma/client";
import { productKeys } from "@/lib/product-keys";
import SearchSkeleton from "./SearchSkeleton";
import SearchResultItem from "./SearchResultItem";

const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT_SEARCHES = 5;

const NavbarSearch = () => {
  const router = useRouter();

  // Input and dropdown state
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Recent searches
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Debounced search query
  const debouncedQuery = useDebounce(query.trim(), 300);

  // Search products
  const { data: searchResults = [], isLoading: isSearchLoading } = useQuery({
    queryKey: productKeys.search(debouncedQuery),
    queryFn: () => productService.search(debouncedQuery),
    enabled: Boolean(debouncedQuery) && showDropdown,
    staleTime: 30 * 1000,
  });

  // Trending products
  const { data: trendingProducts = [], isLoading: isTrendingLoading } =
    useQuery({
      queryKey: productKeys.trending(),
      queryFn: productService.getTrending,
      enabled: showDropdown && !query.trim(),
      staleTime: 5 * 60 * 1000,
    });

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every((item) => typeof item === "string")
        ) {
          setRecentSearches(parsed.slice(0, MAX_RECENT_SEARCHES));
        }
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((search: string) => {
    const value = search.trim();

    if (!value) return;

    setRecentSearches((previous) => {
      const updated = [
        value,
        ...previous.filter(
          (item) => item.toLowerCase() !== value.toLowerCase(),
        ),
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localStorage errors
      }

      return updated;
    });
  }, []);

  // Select product
  const handleSelect = useCallback(
    (product: Product) => {
      saveRecentSearch(query);

      setShowDropdown(false);
      setQuery("");
      setActiveIndex(-1);

      router.push(`/products/${product.slug}`);
    },
    [query, router, saveRecentSearch],
  );

  // Select recent search
  const handleRecentClick = (search: string) => {
    setQuery(search);
    setActiveIndex(-1);
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);

    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Determine dropdown content
  const showRecent = !query.trim() && isHydrated && recentSearches.length > 0;

  const showTrending =
    !query.trim() && isHydrated && recentSearches.length === 0;

  const displayItems = query.trim()
    ? searchResults
    : showRecent
      ? recentSearches
      : trendingProducts;

  const isLoading = query.trim() ? isSearchLoading : isTrendingLoading;

  // Reset active selection when results change
  useEffect(() => {
    setActiveIndex(-1);
    itemRefs.current = [];
  }, [debouncedQuery, recentSearches.length]);

  // Scroll active item into view
  useEffect(() => {
    const activeElement = itemRefs.current[activeIndex];

    activeElement?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        !dropdownRef.current?.contains(target) &&
        !inputRef.current?.contains(target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const totalItems = displayItems.length;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!totalItems) return;

      setActiveIndex((previous) =>
        previous >= totalItems - 1 ? 0 : previous + 1,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!totalItems) return;

      setActiveIndex((previous) =>
        previous <= 0 ? totalItems - 1 : previous - 1,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (activeIndex < 0) return;

      if (query.trim()) {
        const selected = searchResults[activeIndex];

        if (selected) handleSelect(selected);
      } else if (showRecent) {
        const selected = recentSearches[activeIndex];

        if (selected) handleRecentClick(selected);
      } else {
        const selected = trendingProducts[activeIndex];

        if (selected) handleSelect(selected);
      }
    }

    if (event.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const showEmpty =
    Boolean(query.trim()) && !isLoading && searchResults.length === 0;

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setShowDropdown(true);
          setActiveIndex(-1);
        }}
        onFocus={() => setShowDropdown(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        autoComplete="off"
        className="
          rounded-xl border !border-gray-300 pr-12
          shadow-sm transition
          focus:!border-green-600
          focus:ring-2 focus:!ring-green-300
        "
      />

      <Search
        className="
        pointer-events-none absolute right-3 top-1/2
        h-5 w-5 -translate-y-1/2 text-green-500
      "
      />

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="
            absolute z-50 mt-2 max-h-80 w-full
            overflow-y-auto rounded-xl border
            border-gray-200 bg-white shadow-lg
          "
        >
          {/* Loading */}
          {isLoading && <SearchSkeleton />}

          {/* Recent Searches */}
          {showRecent && !isLoading && (
            <div className="px-4 py-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Recent Searches</span>
                </div>

                <button
                  type="button"
                  onClick={clearRecentSearches}
                  className="
                    text-xs text-gray-400
                    transition-colors hover:text-red-500
                  "
                >
                  Clear
                </button>
              </div>

              {recentSearches.map((search, index) => (
                <div
                  key={search}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  onClick={() => handleRecentClick(search)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`
                    flex cursor-pointer items-center gap-2
                    rounded-lg px-3 py-2 text-sm
                    transition-colors
                    ${
                      index === activeIndex
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>{search}</span>
                </div>
              ))}
            </div>
          )}

          {/* Trending Products */}
          {showTrending && !isLoading && (
            <div className="px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp className="h-4 w-4" />
                <span className="font-medium">Trending Products</span>
              </div>

              {trendingProducts.map((product, index) => (
                <div
                  key={product.id}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  onClick={() => handleSelect(product)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`
                    flex cursor-pointer items-center gap-3
                    rounded-lg px-3 py-2
                    transition-colors
                    ${
                      index === activeIndex
                        ? "bg-green-100"
                        : "hover:bg-gray-100"
                    }
                  `}
                >
                  <div
                    className="
                    relative h-10 w-10 shrink-0
                    overflow-hidden rounded-lg
                  "
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {product.title}
                    </p>

                    <p className="text-xs text-gray-500">
                      ৳{product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Search Results */}
          {!isLoading && query.trim() && searchResults.length > 0 && (
            <div className="py-2">
              {searchResults.map((product, index) => (
                <div
                  key={product.id}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                >
                  <SearchResultItem
                    product={product}
                    query={query}
                    active={index === activeIndex}
                    onSelect={handleSelect}
                    onHover={() => setActiveIndex(index)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <div className="px-4 py-8 text-center">
              <PackageX
                className="
                mx-auto mb-3 h-12 w-12 text-gray-300
              "
              />

              <p className="font-medium text-gray-500">No results found</p>

              <p className="mt-1 text-sm text-gray-400">
                Try different keywords or check spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(NavbarSearch);
