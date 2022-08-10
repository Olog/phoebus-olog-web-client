import { Alert } from "react-bootstrap";

const ErrorBanner = ({title, error}) => {

    let message = "An unhandled error occured";
    let variant = "danger";
    
    if(error.status === 'FETCH_ERROR') {
        variant = "warning";
        message = "Could not reach the underlying service";
        console.warn(message, error);
    } else {
        console.error(message, error);
    }

    return (
        <Alert variant={variant} className="w-100 mb-0">
            <Alert.Heading>{title}</Alert.Heading>
            <p>{message}</p>
        </Alert>
    );

}

export default ErrorBanner;