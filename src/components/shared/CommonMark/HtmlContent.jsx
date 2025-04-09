import { Box, styled } from "@mui/material";

const Container = styled(Box)(({ theme }) => {
  return `

        word-wrap: break-word;
        padding: 2rem 0;
        font-size: 1rem;
        font-family: "Roboto", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-weight: 400;
        color: ${theme.palette.grey[900]};

        /** Text Elements **/
        h1, h2 {
            padding-bottom: 0.5rem;
        }
        h1 {
            margin: .3em 0 0.5em;
            font-size: 1.8rem;
        }
        h2 {
            margin: 1em 0 0.5em;
            font-size: 1.4rem;
        }
        p {
            padding: 1rem 0;
        }
        h3, h4 {
            padding-bottom: 0.5rem;
        }

        /** Links **/
        a, a:visited {
            color: ${theme.palette.primary.main};
            text-decoration: underline;
        }
        a:hover {
            cursor: pointer;
        }

        /** Block Quotes **/
        blockquote {
            border-left: 5px solid ${theme.palette.grey[400]};
            padding: 0rem 15px;
            margin: 0rem 15px;
        }

        /** Lists **/
        /** Unfortunately no good way of using selectors
         *  to enforce alternating bullet styles purely
         *  with CSS; this supports six levels, which
         *  should be enough
         **/
        ul,
        ul li,
        ul li li li,
        ul li li li li li {
            list-style: disc inside;
        }
        ul li li,
        ul li li li li,
        ul li li li li li li {
            list-style: circle inside;
        }
        ul li li li,
        ul li li li li li {
            list-style: square inside;
        }
        ol,
        ol li,
        ol li li li {
            list-style: decimal inside;
        }
        ol li li,
        ol li li li li {
            list-style: lower-alpha inside;
        }
        ul, ol,
        li > ul,
        li > ol {
            padding-left: 2rem;
        }
        li > p {
            /* prevent newline for paragraphs inside of list items */
            display: inline-block;
            padding-bottom: 0.25rem;
        }
        ul + *,
        ol + * {
            padding-top: 1rem;
        }

        /** Code **/
        code, pre {
            padding: 0.2rem 0.5rem;
            background-color: ${theme.palette.grey[200]};
            border: 1px solid ${theme.palette.grey[300]};
            border-radius: 4px;
            font-family: monospace;
        }
        pre code {
            border: none;
            padding: 0;
        }
        pre {
            word-wrap: break-word !important;
            whitespace: pre-wrap;
            overflow-x: scroll;
        }

        /** Images should be constrained so users don't need
         *  to scroll a horizontal scrollbar
         **/
        p img {
            max-width: 100%;
            max-height: 100%;
            height: auto;
        }

        /** Horizontal Rule **/
        hr {
            border: none;
            border-top: 3px solid ${theme.palette.grey[300]};
            margin-top: 1rem;
        }

        /** Table Styling **/
        table {
            border-collapse: collapse;
        }

        table th, table td {
            border: 1px solid  ${theme.palette.grey[400]};
            padding: 0.3rem;
        }
        table th {
            text-align: left;
            background-color: ${theme.palette.primary.main};
            color: white;
            padding: 0.5rem 0.3rem;
        }

        table tr:nth-of-type(even){
            background-color: ${theme.palette.grey[200]};
        }

        table tr:hover {
            background-color:  ${theme.palette.grey[300]};
        }
               padding: 0;
    & > p {
        padding: 0;
        margin: 0;
    }
    & > blockquote > p{
        padding: 10px;
        margin: 0;
    }
    width: 100%;
    font-size: 1rem;

    `;
});

const HtmlContent = ({ html, className, ...props }) => {
  return (
    <Container
      dangerouslySetInnerHTML={{ __html: html }}
      className={className}
      {...props}
    />
  );
};

export default HtmlContent;
