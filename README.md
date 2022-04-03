# code-test-monzo

## Problem

We'd like you to write a simple web crawler in a programming language you're familiar with. Given a starting URL, the crawler should visit each URL it finds on the same domain. It should print each URL visited, and a list of links found on that page. The crawler should be limited to one subdomain - so when you start with *https://monzo.com/*, it would crawl all pages on the monzo.com website, but not follow external links, for example to facebook.com or community.monzo.com.

We would like to see your own implementation of a web crawler. Please do not use frameworks like scrapy or go-colly which handle all the crawling behind the scenes or someone else's code. You are welcome to use libraries to handle things like HTML parsing.

### Requirements

- Write a simple web crawler
- Should print each URL visited, and a list of links found on that page
- Input is a starting URL
- Crawler should visit each URL it finds on the same domain
- Crawler should be limited to one subdomain (eg. monzo.com !== community.monzo.com)
- Crawler should not follow external links (eg. facebook.com)

### Assumptions

- While subdomain and external links should be included in the sitemap list of urls.
- Invalid urls should be filtered and not parsed.
- Urls that return 404 should be returned but show they link to nothing.
- Links that connect specific elements on a page should be included on a pages list or urls, but should not be checked themselves.
- Duplicate links on a page should only be shown once

---

## System Design

- Filter - Takes in an array of urls and removes any that don't belong to the domain, have been visited before, or are duplicated.
- Parser - Fetches webpages and extracts links from them.
- Crawler - Uses breadth first search to find all pages belong to a domain and returns them.

---

## Setup

Make sure you have at lease `Node 16` installed or are using [Volta](https://volta.sh/).

To setup the project run:

```
make setup
```

To run the test suite run:

```
make test
or
make test-watch
```

---

## CLI

Using the cli you can input a starting url. Which will then be crawled and site map file will be created.

To use the cli run:

```
site-mapper

---
Usage: site-mapper [options]

Options:
      --version  Show version number        [boolean]
  -u, --url      Starting url for crawler   [string] [required]
```

example mapping `monzo.com`:

```
site-mapper -u https://monzo.com
---
Crawling...
Written to file: monzo.com.txt

===Results===
Total pages: 4683
Crawl time: 3:43.907 (m:ss.mmm)
```
