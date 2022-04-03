import axios from "axios";
import { crawler } from "../crawler";
import {
  multipleLinks,
  noLinks,
  singleAbsoluteLink,
  singleRelativeLink,
} from "./data/htmlResponses";

jest.mock("axios");

describe("crawler", () => {
  describe("starting page has links", () => {
    beforeEach(() => {
      axios.get = jest
        .fn()
        .mockResolvedValue({ data: noLinks })
        .mockResolvedValueOnce({ data: multipleLinks })
        .mockResolvedValueOnce({ data: singleAbsoluteLink })
        .mockResolvedValueOnce({ data: singleRelativeLink });
    });

    it("should call axios get five times", async () => {
      const response = await crawler(new URL("https://test.com/"));
      expect(axios.get).toBeCalledTimes(5);
      expect(axios.get).toHaveBeenNthCalledWith(1, "https://test.com/");
      expect(axios.get).toHaveBeenNthCalledWith(2, "https://test.com/about");
      expect(axios.get).toHaveBeenNthCalledWith(3, "https://test.com/contact");
      expect(axios.get).toHaveBeenNthCalledWith(4, "https://test.com/square");
      expect(axios.get).toHaveBeenNthCalledWith(5, "https://test.com/banking");
    });

    it("should return site map", async () => {
      const response = await crawler(new URL("https://test.com/"));

      expect(response).toStrictEqual({
        "https://test.com/": [
          new URL("https://test.com/about"),
          new URL("https://testbook.com/"),
          new URL("https://test.com/contact"),
        ],
        "https://test.com/about": [new URL("https://test.com/square")],
        "https://test.com/contact": [new URL("https://test.com/banking")],
        "https://test.com/square": [],
        "https://test.com/banking": [],
      });
    });
  });

  describe("starting page has no links", () => {
    beforeEach(() => {
      axios.get = jest.fn().mockResolvedValue({ data: noLinks });
    });

    it("should call axios get once", async () => {
      const response = await crawler(new URL("https://test.com/"));
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toHaveBeenNthCalledWith(1, "https://test.com/");
    });

    it("should return site map with no links", async () => {
      const response = await crawler(new URL("https://test.com/"));

      expect(response).toStrictEqual({
        "https://test.com/": [],
      });
    });
  });

  describe("starting page 404s", () => {
    beforeEach(() => {
      axios.get = jest.fn().mockRejectedValue(new Error("Page does not exist"));
    });

    it("should call axios get once ", async () => {
      const response = await crawler(new URL("https://test.com/"));
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toHaveBeenNthCalledWith(1, "https://test.com/");
    });

    it("should return site map with no links", async () => {
      const response = await crawler(new URL("https://test.com/"));

      expect(response).toStrictEqual({
        "https://test.com/": [],
      });
    });
  });
});
