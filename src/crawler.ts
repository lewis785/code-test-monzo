import { filter } from "./filter";
import { parser } from "./parser";
import { SiteMap } from "./types";

export const crawler = async (url: URL) => {
  return await crawl([url], new Set([]), {}, url);
};

const crawl = async (
  visit: URL[],
  visited: Set<string>,
  siteMap: SiteMap,
  domain: URL
): Promise<SiteMap> => {
  if (visit.length === 0) {
    return siteMap;
  }

  const pages = await Promise.all(
    [...visit].map((url) => {
      visited.add(url.href);
      return parser(url);
    })
  );

  let toVisit: URL[] = [];
  let newSiteMap: SiteMap = { ...siteMap };

  pages.forEach((page) => {
    newSiteMap = { ...newSiteMap, [page.url.href]: page.links };
    toVisit = [...toVisit, ...page.links];
  });

  const filteredToVisit = filter(domain, toVisit, visited);

  return crawl(filteredToVisit, visited, newSiteMap, domain);
};
