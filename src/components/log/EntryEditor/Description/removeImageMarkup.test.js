import { test, expect } from "vitest";
import removeImageMarkup from "./removeImageMarkup";

test("removeImageMarkupNoOtherContent", () => {
  let markup = "![](attachment/123456789){width=100 height=100}";
  let result = removeImageMarkup(markup, "123456789");
  expect(result).toBe("");
});

test("removeImageMarkupWithOtherContent", () => {
  let markup = "ABC ![](attachment/123456789){width=100 height=100} DEF";
  let result = removeImageMarkup(markup, "123456789");
  expect(result).toBe("ABC  DEF");
});

test("removeImageMarkupMultipleEmbeddedImages", () => {
  let markup =
    "![](attachment/ABCDE){width=100 height=100}\n![](attachment/123456789){width=100 height=100}\n![](attachment/abcde){width=100 height=100}";
  let result = removeImageMarkup(markup, "123456789");
  expect(result).toBe(
    "![](attachment/ABCDE){width=100 height=100}\n\n![](attachment/abcde){width=100 height=100}"
  );
});

test("removeImageMarkupNonMatchingImageMarkup", () => {
  let markup = "![](attachment/123456789){width=100 height=100}";
  let result = removeImageMarkup(markup, "abcde");
  expect(result).toBe("![](attachment/123456789){width=100 height=100}");
});

test("removeImageMarkupNoImageMarkup", () => {
  let markup = "whatever";
  let result = removeImageMarkup(markup, "123456789");
  expect(result).toBe("whatever");
});
