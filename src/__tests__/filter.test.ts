import { filter } from "../filter";

describe("filter", () => {
  const domain = new URL("http://test.com");
  let toVisit: URL[];
  let visited: Set<string>;

  describe("empty visited", () => {
    beforeEach(() => {
      visited = new Set([]);
    });

    it("should return input when domains match", () => {
      toVisit = [
        new URL("http://test.com/about"),
        new URL("http://test.com/contact"),
        new URL("http://test.com/career"),
      ];
      expect(filter(domain, toVisit, visited)).toStrictEqual(toVisit);
    });

    it("should filter out subdomains", () => {
      toVisit = [
        new URL("http://dev.test.com"),
        new URL("http://stage.test.com"),
        new URL("http://info.test.com"),
      ];
      expect(filter(domain, toVisit, visited)).toStrictEqual([]);
    });

    it("should filter out non domain urls", () => {
      toVisit = [
        new URL("http://monzo.com"),
        new URL("http://test.co.uk/contact"),
        new URL("http://square.com/career"),
      ];
      expect(filter(domain, toVisit, visited)).toStrictEqual([]);
    });
  });

  describe("with visited", () => {
    beforeEach(() => {
      visited = new Set(["http://test.com/about"]);
    });

    it("should filter out already visited urls", () => {
      toVisit = [
        new URL("http://test.com/about"),
        new URL("http://test.com/contact"),
        new URL("http://test.com/career"),
      ];
      expect(filter(domain, toVisit, visited)).toStrictEqual([
        new URL("http://test.com/contact"),
        new URL("http://test.com/career"),
      ]);
    });

    it("should filter out already visited urls and different domains", () => {
      toVisit = [
        new URL("http://test.com/about"),
        new URL("http://dev.test.com/contact"),
        new URL("http://square.com/career"),
      ];
      expect(filter(domain, toVisit, visited)).toStrictEqual([]);
    });
  });
});
