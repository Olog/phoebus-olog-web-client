import styled from "styled-components";

const Alert = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background-color: ${({variant, theme}) => theme.colors[variant] || theme.colors.default };
    width: 100%;
`

const ServiceErrorBanner = ({title, error, serviceName="underlying"}) => {

    let message = "An unhandled error occured";
    let variant = "danger";
    
    if(error.status === 'FETCH_ERROR') {
        variant = "warning";
        message = `Could not reach the ${serviceName} service`;
        console.warn(message, error);
    } else {
        console.error(message, error);
    }

    return (
        <Alert variant={variant} >
            <h2>{title}</h2>
            <p>{message}</p>
        </Alert>
    );

}

export default ServiceErrorBanner;