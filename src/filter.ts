export const filter = (domain: URL, toVisit: URL[], visited: Set<string>) => {
  return [...toVisit].filter((url) => {
    const canVisit = canBeVisited(url, visited, domain);
    visited.add(url.href);
    return canVisit;
  });
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
