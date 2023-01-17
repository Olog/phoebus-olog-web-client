import styled from "styled-components";

const Container = styled.div`
    word-wrap: break-word;

    & table {
        border-collapse: collapse;
    }

    & table th, & table td {
        border: 1px solid #ddd;
        padding: 3px;
    }

    & table tr:nth-child(even){
        background-color: #f2f2f2;
    }

    & table tr:hover {
        background-color: #ddd;
    }

    & table th {
        text-align: left;
        background-color: #0095CA;
        color: white;
    }
`

const HtmlContent = ({html, className}) => {
    return <Container dangerouslySetInnerHTML={html} className={className} />
}

export default HtmlContent;