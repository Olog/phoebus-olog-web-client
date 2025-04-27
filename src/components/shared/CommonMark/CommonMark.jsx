import { useEffect, useState } from "react";
import { styled, Typography } from "@mui/material";
import markdownit from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import DOMPurify from "dompurify";
import HtmlContent from "./HtmlContent";
import { parseEmbeddedImages } from "src/beta/utils/parseEmbeddedImages";

const md = markdownit().use(markdownItAttrs);

const htmlToPlainText = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

export const CommonMark = styled(
  ({ commonmarkSrc, className, isSummary, isPreview, ...props }) => {
    const [html, setHtml] = useState("");
    useEffect(() => {
      const parsedEmbeddedImages = parseEmbeddedImages(commonmarkSrc);
      const renderedHtml = md.render(parsedEmbeddedImages ?? commonmarkSrc);
      if (isPreview) {
        setHtml(renderedHtml);
      } else {
        setHtml(DOMPurify.sanitize(renderedHtml));
      }
    }, [commonmarkSrc, isPreview]);

    const plainText = htmlToPlainText(html);
    const summary =
      plainText.length > 100 ? `${plainText.slice(0, 100)}...` : plainText;

    if (isSummary) {
      return (
        <Typography
          className={className}
          mb={0.2}
          sx={{
            maxHeight: "22px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {summary}
        </Typography>
      );
    }

    return (
      <HtmlContent
        className={className}
        html={html}
        {...props}
      />
    );
  }
)({});
