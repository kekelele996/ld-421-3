export function usePagination<T>(items: T[], page = 1, pageSize = 10) {
  const total = items.length;
  const start = (page - 1) * pageSize;
  return { page, pageSize, total, pageItems: items.slice(start, start + pageSize) };
}
