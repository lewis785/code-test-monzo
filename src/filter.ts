export const filter = (
  domain: URL,
  toVisit: Set<URL>,
  visited: Set<string>
) => {
  const filteredToVisit = [...toVisit].filter(
    (url) => url.hostname === domain.hostname && !visited.has(url.href)
  );

  return new Set(filteredToVisit);
};
