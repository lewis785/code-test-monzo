import axios from "axios";

import { parser } from "../parser";

jest.mock("axios");

describe("parse", () => {
  let url = new URL("http://test.com");
  const baseUrl = "http://base.com";

  it("should call axios with url", async () => {
    await parser(baseUrl, url);
    expect(axios.get).toHaveBeenCalledWith("http://test.com/");
  });

  describe("page exists", () => {
    it("should contain url", async () => {
      const mockResponse =
        '<a href="http://test.com/about" /><button>Test</button><a href="http://testbook.com/connect" />';
      axios.get = jest.fn().mockResolvedValue({ data: mockResponse });

      const response = await parser(baseUrl, url);
      expect(response.url).toBe(url);
    });

    it.each([
      [
        "absolute paths",
        '<a href="http://test.com/about" /><button>Test</button><a href="http://testbook.com/connect" />',
        [
          new URL("http://test.com/about"),
          new URL("http://testbook.com/connect"),
        ],
      ],
      [
        "relative paths",
        '<a href="/about" /><button>Test</button><a href="/connect" />',
        [new URL("http://base.com/about"), new URL("http://base.com/connect")],
      ],
      [
        "mixed paths",
        '<a href="http://test.com/about" /><button>Test</button><a href="/connect" />',
        [new URL("http://test.com/about"), new URL("http://base.com/connect")],
      ],
    ])(
      "should contain correct links when hrefs are %s",
      async (_, html, expectedUrls) => {
        axios.get = jest.fn().mockResolvedValue({ data: html });
        const response = await parser(baseUrl, url);
        expect(response.links).toStrictEqual(new Set(expectedUrls));
      }
    );
  });

  describe("page does not exist", () => {
    beforeEach(() => {
      axios.get = jest.fn().mockRejectedValueOnce(new Error("404"));
    });

    it("should contain url", async () => {
      const response = await parser(baseUrl, url);
      expect(response.url).toBe(url);
    });

    it("should contain zero links", async () => {
      const response = await parser(baseUrl, url);
      expect(response.links.size).toBe(0);
    });
  });
});
