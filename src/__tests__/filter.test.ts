import { createFilter } from "../filter";

describe("filter", () => {
  let toVisit: Set<URL>;
  let visited: Set<string>;

  describe("empty visited", () => {
    beforeEach(() => {
      visited = new Set([]);
    });

    it("should return input when domains match", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        new URL("http://test.com/about"),
        new URL("http://test.com/contact"),
        new URL("http://test.com/career"),
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(toVisit);
    });

    it("should filter out subdomains", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        new URL("http://dev.test.com"),
        new URL("http://stage.test.com"),
        new URL("http://info.test.com"),
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });

    it("should filter out non domain urls", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        new URL("http://monzo.com"),
        new URL("http://test.co.uk/contact"),
        new URL("http://square.com/career"),
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });

    // it("should filter out invalid urls", () => {
    //   const filter = createFilter(new URL("http://test.com"));
    //   toVisit = new Set(["test.com"]);
    //   expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    // });
  });

  describe("with visited", () => {
    beforeEach(() => {
      visited = new Set(["http://test.com/about"]);
    });

    it("should filter out already visited urls", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        new URL("http://test.com/about"),
        new URL("http://test.com/contact"),
        new URL("http://test.com/career"),
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(
        new Set([
          new URL("http://test.com/contact"),
          new URL("http://test.com/career"),
        ])
      );
    });

    it("should filter out already visited urls and different domains", () => {
      const filter = createFilter(new URL("http://test.com"));
      toVisit = new Set([
        new URL("http://test.com/about"),
        new URL("http://dev.test.com/contact"),
        new URL("http://square.com/career"),
      ]);
      expect(filter(toVisit, visited)).toStrictEqual(new Set([]));
    });
  });
});
