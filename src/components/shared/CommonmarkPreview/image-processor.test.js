/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
import { Remarkable } from "remarkable";
import imageProcessor, {
  matchImage,
  matchSizeDefinition
} from "./image-processor";

test("Image markup conversion", () => {
  let remarkable = new Remarkable("full", {
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: "language-", // CSS language prefix for fenced blocks
    linkTarget: "", // set target to open link in
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: "“”‘’"
  });
  remarkable.use(imageProcessor);
  let imageString =
    "**bold** preceding text ![](http=whatever) trailing text *italic*";
  expect(remarkable.render(imageString)).toBe(
    '<p><strong>bold</strong> preceding text <img src="http=whatever" alt=""> trailing text <em>italic</em></p>\n'
  );

  imageString = "![foobar](http=whatever)";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt="foobar"></p>\n'
  );

  imageString = "![](http=whatever)";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt=""></p>\n'
  );

  imageString = "![](http=whatever){width=640 height=480}foobar";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt="" width=640 height=480>foobar</p>\n'
  );

  imageString = "![](http=whatever){WIDTH=640 HEIGHT=480}";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt="" width=640 height=480></p>\n'
  );

  imageString = "![](http=whatever){width=640 height=480} foobar";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt="" width=640 height=480> foobar</p>\n'
  );

  imageString =
    "![](http=whatever){width=640 height=480}![](http=whatever){width=640 height=480}";
  expect(remarkable.render(imageString)).toBe(
    '<p><img src="http=whatever" alt="" width=640 height=480><img src="http=whatever" alt="" width=640 height=480></p>\n'
  );

  imageString =
    "preceding text ![](http=whatever){width=640 height=480} intermediate text ![](http=whatever){width=640 height=480} trailing text";
  expect(remarkable.render(imageString)).toBe(
    '<p>preceding text <img src="http=whatever" alt="" width=640 height=480> intermediate text <img src="http=whatever" alt="" width=640 height=480> trailing text</p>\n'
  );

  imageString =
    "**bold** preceding text ![](http=whatever) trailing text *italic*";
  expect(remarkable.render(imageString)).toBe(
    '<p><strong>bold</strong> preceding text <img src="http=whatever" alt=""> trailing text <em>italic</em></p>\n'
  );

  imageString =
    "**bold** preceding text ![](relative/image.jpg){width=640 height=480}";
  expect(remarkable.render(imageString)).toBe(
    '<p><strong>bold</strong> preceding text <img src="relative/image.jpg" alt="" width=640 height=480></p>\n'
  );
});

test("Image markup conversion, no image", () => {
  let remarkable = new Remarkable("full", {
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    langPrefix: "language-", // CSS language prefix for fenced blocks
    linkTarget: "", // set target to open link in
    // Enable some language-neutral replacements + quotes beautification
    typographer: false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Set doubles to '«»' for Russian, '„“' for German.
    quotes: "“”‘’"
  });
  remarkable.use(imageProcessor);
  let markupString = "**This does not contain an image**";
  expect(remarkable.render(markupString)).toBe(
    "<p><strong>This does not contain an image</strong></p>\n"
  );
});

test("Macth image markup", () => {
  expect(matchImage("![](http://foo.bar)")).toBeDefined();
  expect(
    matchImage("preceding text ![](http://foo.bar) trailing text")
  ).toBeDefined();
  expect(matchImage("nonmatching")).toBeNull();
});

test("Match size definition", () => {
  let result = matchSizeDefinition("{width=100 height=100}");
  expect(result).toBeDefined();
  expect(result[0]).toBe("{width=100 height=100}");
  expect(result[1]).toBe("{width=100 height=100}");
  expect(result[2]).toBe("width=100 height=100");
  expect(result[3]).toBe("");

  result = matchSizeDefinition("foobar");
  expect(result).toBeDefined();
  expect(result[0]).toBe("foobar");
  expect(result[1]).toBeUndefined();
  expect(result[2]).toBeUndefined();
  expect(result[3]).toBe("foobar");

  result = matchSizeDefinition("{width=100 height=100} extra text");
  expect(result).toBeDefined();
  expect(result[0]).toBe("{width=100 height=100} extra text");
  expect(result[1]).toBe("{width=100 height=100}");
  expect(result[2]).toBe("width=100 height=100");
  expect(result[3]).toBe(" extra text");
});
