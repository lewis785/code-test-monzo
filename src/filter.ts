export const createFilter =
  (domain: URL) => (toVisit: Set<string>, visited: Set<string>) => {
    return new Set(
      [...toVisit].filter((urlString) => {
        if (isInvalidUrl(urlString)) {
          return false;
        }
        const url = new URL(urlString);
        return url.hostname === domain.hostname && !visited.has(urlString);
      })
    );
  };

const isInvalidUrl = (urlString: string) => {
  try {
    new URL(urlString);
  } catch {
    return true;
  }

  return false;
};
