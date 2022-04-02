import { UrlMap } from "./types";
import axios from "axios";
import { parse } from "node-html-parser";

export const parser = async (baseUrl: string, url: URL): Promise<UrlMap> => {
  const htmlString = await retrieveHtml(url);
  if (htmlString === null) {
    return { url, links: new Set([]) };
  }

  return { url, links: new Set(findAndParseLinks(htmlString, baseUrl)) };
};

const retrieveHtml = async (url: URL): Promise<string | null> => {
  try {
    const { data } = await axios.get(url.href);
    return data;
  } catch {
    return null;
  }
};

const findAndParseLinks = (htmlString: string, baseUrl: string) => {
  return parse(htmlString)
    .querySelectorAll("a")
    .map((link) => new URL(link.rawAttributes.href, baseUrl));
};
