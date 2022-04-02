import { createFilter } from "../filter";

describe("filter", () => {
  let toVisit: Set<string>;
  let visited: Set<string>;

  describe("empty visited", () => {
    beforeEach(() => {
      visited = new Set([]);
    });

    it("should return input when domains match", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        "http://test.com/about",
        "http://test.com/contact",
        "http://test.com/career",
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(toVisit);
    });

    it("should filter out subdomains", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        "http://dev.test.com",
        "http://stage.test.com",
        "http://info.test.com",
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });

    it("should filter out non domain urls", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        "http://monzo.com",
        "http://test.co.uk/contact",
        "http://square.com/career",
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });

    it("should filter out invalid urls", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set(["test.com"]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });
  });

  describe("with visited", () => {
    beforeEach(() => {
      visited = new Set(["http://test.com/about"]);
    });

    it("should filter out already visited urls", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        "http://test.com/about",
        "http://test.com/contact",
        "http://test.com/career",
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(
        new Set(["http://test.com/contact", "http://test.com/career"])
      );
    });

    it("should filter out already visited urls and different domains", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        "http://test.com/about",
        "http://dev.test.com/contact",
        "http://square.com/career",
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });
  });
});
