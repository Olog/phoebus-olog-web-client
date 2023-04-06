import styled from "styled-components";

const Container = styled.div`
    word-wrap: break-word;
    width: 100%;
    padding: 2rem 0;
    font-size: 1.3rem;
    font-family: "Roboto", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight: 400;
    color: #222;


    /** Text Elements **/
    h1, h2 {
        padding-bottom: 0.5rem;
    }
    h1 {
        font-size: 2.8rem;
    }
    h2 {
        font-size: 2.1rem;
    }
    p {
        padding: 1rem 0;
    }
    h3, h4 {
        padding-bottom: 0.5rem;
    }
    
    /** Links **/
    a, a:visited {
        color: ${({theme}) => theme.colors.primary};
        text-decoration: underline;
    }
    a:hover {
        cursor: pointer;
    }

    /** Block Quotes **/
    blockquote {
        border-left: 5px solid #ccc;
        padding: 0.5rem 10px;
        margin: 1.5em 10px;
    }

    /** Lists **/
    ul {
        list-style: disc inside;
    }
    ol {
        list-style: decimal inside;
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
        background-color: #f1f1f1;
        border: 1px solid #e1e1e1;
        border-radius: 4px;
        font-family: monospace;
    }
    pre code {
        border: none;
        padding: 0;
    }

    /** Horizontal Rule **/
    hr {
        border: none;
        border-top: 3px solid #E1E1E1;
        margin-top: 1rem;
    }

    /** Table Styling **/
    table {
        border-collapse: collapse;
    }

    table th, table td {
        border: 1px solid #ddd;
        padding: 0.3rem;
    }
    table th {
        text-align: left;
        background-color: #0095CA;
        color: white;
        padding: 0.5rem 0.3rem;
    }

    table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    table tr:hover {
        background-color: #ddd;
    }

`

const HtmlContent = ({html, className}) => {
    return <Container dangerouslySetInnerHTML={html} className={className} />
}

export default HtmlContent;