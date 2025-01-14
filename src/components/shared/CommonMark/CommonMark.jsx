import React, { useEffect, useState } from "react";
import { styled } from "@mui/material";
import markdownit from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import DOMPurify from "dompurify";
import HtmlContent from "./HtmlContent";

const md = markdownit().use(markdownItAttrs);

const htmlToPlainText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const CommonMark = styled(
  ({ commonmarkSrc, className, isSummary, ...props }) => {
    const [html, setHtml] = useState("");
    useEffect(() => {
      setHtml(DOMPurify.sanitize(md.render(commonmarkSrc)));
    }, [commonmarkSrc]);

    const plainText = htmlToPlainText(html);
    const summary =
      plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;

    return (
      <HtmlContent
        className={className}
        html={isSummary ? summary : html}
        {...props}
      />
    );
  }
)({});
