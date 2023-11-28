import React, { useEffect, useState } from "react";
import { Alert, Button, Tooltip, styled, tooltipClasses } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';

const StyledTooltip = styled(({className, ...props})=> {
    return (
        <Tooltip {...props} classes={{popper: className}} />
    )
})(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: 'transparent'
    }
}))

const CopyUrlButton = ({url}) => {

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if(open) {
            const id = setTimeout(() => {
                setOpen(false);
            }, [1000]);

            return () => {
                clearTimeout(id);
            }
        }
    }, [open])

    const onClick = () => {
        navigator.clipboard.writeText(url);
        setOpen(true);
    }

    return (
        <StyledTooltip
            title={
                <Alert severity="success" variant="standard" sx={{ 
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: "success.light"
                }} >
                    Url copied!
                </Alert>
            }
            open={open}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            PopperProps={{
                disablePortal: true,
            }}
        >
            <Button
                startIcon={<ShareIcon />}
                onClick={onClick}
            >
                Copy URL
            </Button>
        </StyledTooltip>
    )
}

export default CopyUrlButton;