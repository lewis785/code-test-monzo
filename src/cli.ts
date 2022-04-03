#!/usr/bin/env node

import yargs, { exit, string } from "yargs";
import { writeFileSync } from "fs";
import { SiteMap } from "./types";
import { crawler } from "./crawler";

const argv = yargs
  .usage("Usage: $0 [options]")
  .option("url", {
    alias: "u",
    type: "string",
    demandOption: true,
    describe: "Starting url for crawler",
  })
  .help()
  .alias("help", "help").argv;

let url: URL;
try {
  url = new URL(argv.url);

  console.time("Crawl time");
  console.log("Crawling...");
  crawler(url).then((response) => {
    writeToFile(url.hostname, response);
    outputResult(response);
  });
} catch {
  console.log('Invalid url provided, example: "https://test.com/"');
  exit(1, new Error('Invalid url provided, example: "https://test.com/'));
}

const outputResult = (siteMap: SiteMap) => {
  const totalPages = Object.keys(siteMap).length;
  console.log("\n===Results===");
  console.log(`Total pages: ${totalPages}`);
  console.timeEnd("Crawl time");
};

const writeToFile = (filename: string, siteMap: SiteMap) => {
  writeFileSync(`${filename}.txt`, convertSiteMapToString(siteMap));
  console.log(`Written to file: ${filename}.txt`);
};

const convertSiteMapToString = (siteMap: SiteMap) => {
  const pages = Object.keys(siteMap);

  return pages
    .map((page) => {
      const links = siteMap[page].map((link) => `\t- ${link.href}`).join("\n");

      return `${page}\n${links}`;
    })
    .join("\n\n");
};
