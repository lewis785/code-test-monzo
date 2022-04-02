import { UrlMap } from "./types";
import axios from "axios";
import { parse } from "node-html-parser";

export const parser = async (url: URL): Promise<UrlMap> => {
  const htmlString = await retrieveHtml(url);
  if (htmlString === null) {
    return { url, links: new Set([]) };
  }

  return { url, links: new Set(findAndParseLinks(htmlString, url)) };
};

const retrieveHtml = async (url: URL): Promise<string | null> => {
  try {
    const { data } = await axios.get(url.href);
    return data;
  } catch {
    return null;
  }
};

const findAndParseLinks = (htmlString: string, baseUrl: URL) => {
  const links = new Set(
    parse(htmlString)
      .querySelectorAll("a")
      .map((link) => link.rawAttributes.href)
  );

  return [...links].map((link) => createUrl(link, baseUrl));
};

const createUrl = (path: string, baseUrl: URL) => {
  if (isLinkToElement(path)) {
    return new URL(path, baseUrl.href);
  }

  return new URL(path, baseUrl.origin);
};

const isLinkToElement = (path: string) => {
  return /\#[\w|-]*$/.test(path);
};
