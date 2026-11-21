export const productKeys = {
  all: ["products"] as const,

  search: (query: string) => [...productKeys.all, "search", query] as const,

  trending: () => [...productKeys.all, "trending"] as const,
};
