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

import { Box, Dialog, DialogActions, DialogContent, DialogContentText, IconButton, Stack, Typography, styled } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const ModalTitle = styled(({ onClose, className, children }) => {
    return (
        <Stack
            className={className}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor="primary.main"
            color="ologWhite.main"
            paddingX={2}
            paddingY={1}
        >
            {typeof children === "string" ? <Typography>{children}</Typography> : <>{children}</>}
            <IconButton
                variant="outlined"
                onClick={onClose}
                aria-label="Close Dialog"
                edge="end"
            >
                <CloseIcon fontSize="medium" color="ologWhite" />
            </IconButton>
        </Stack>
    )
})({});

const Modal = ({ title, content, actions, open, onClose, className, DialogProps = {} }) => {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth={true}
            maxWidth="sm"
            {...DialogProps}
        >
            {title ? <ModalTitle onClose={onClose}>{title}</ModalTitle> : null}
            <DialogContent
                className={className}
            >
                {typeof content === "string" ?
                    <DialogContentText>
                        {content}
                    </DialogContentText>
                    : <>{content}</>
                }
            </DialogContent>
            {actions ? <DialogActions>{actions}</DialogActions> : null}
        </Dialog>
    )
};

export default Modal;