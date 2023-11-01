import { useState } from "react";
import { Snackbar, Alert, AlertTitle, Stack } from "@mui/material";

const ServiceErrorBanner = ({title, error, serviceName="underlying"}) => {

    const [open, setOpen] = useState(true);

    let message = "An unhandled error occured";
    let severity = "error";
    
    if(error.status === 'FETCH_ERROR') {
        severity = "warning";
        message = `Could not reach the ${serviceName} service`;
        console.warn(message, error);
    } else {
        console.error(message, error);
    }

    return (
        <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "center" }} >
            <Stack flexDirection="row" >
                <Alert severity={severity} onClose={() => setOpen(false)}>
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            </Stack>
        </Snackbar>
    );

}

export default ServiceErrorBanner;