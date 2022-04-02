export const filter = (domain: URL, toVisit: URL[], visited: Set<string>) => {
  const filteredToVisit = [...toVisit].filter((url) => {
    const canVisit = canBeVisited(url, visited, domain);
    visited.add(url.href);
    return canVisit;
  });

  return new Set(filteredToVisit);
};

const canBeVisited = (url: URL, visited: Set<string>, domain: URL) => {
  if (url.hostname !== domain.hostname) {
    return false;
  }

  if (visited.has(url.href)) {
    return false;
  }

  if (isLinkToElement(url.href)) {
    return false;
  }

  return true;
};

const isLinkToElement = (path: string) => {
  return /\#[\w|-]*$/.test(path);
};
