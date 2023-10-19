/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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
import { FaRegFile } from "react-icons/fa";
import styled from 'styled-components';
import { BsXCircle } from 'react-icons/bs';
import { useState } from 'react';
import Modal from 'components/shared/Modal';
import { Stack, Typography } from "@mui/material";

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`;

const ImageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.10);
    flex-grow: 1;

    &:hover {
        cursor: pointer;
    }
`

const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    overflow: hidden;
    flex-grow: 1;
`

const ImageHeader = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

const CloseIcon = styled.button`
    background-color: transparent;
    border: none;
    &:hover {
        cursor: pointer;
    }
`

const FileIcon = styled(FaRegFile)`
    filter: opacity(40%);
`

const CaptionContainer = styled.div`

`
const Caption = styled.figcaption`
    font-style: italic;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`

const Attachment = ({attachment, removeAttachment, className}) => {

    const [showPreview, setShowPreview] = useState(false);

    const isImage = attachment?.file?.type?.toLowerCase()?.startsWith("image");
    
    const previewImage = () => {
        setShowPreview(true);
    }

    const image = isImage
        ? <Image src={URL.createObjectURL(attachment.file)} alt={attachment.file.name} />
        : <FileIcon size={'5rem'}/>;
    
    return (
        <>
            <Container className={className}>
                <ImageHeader>
                    <CloseIcon type='button' onClick={() => removeAttachment(attachment.file)} aria-label={`remove ${attachment.file.name}`}>
                        <BsXCircle />
                    </CloseIcon>
                </ImageHeader>
                <ImageContainer onClick={previewImage} >
                    {image}
                </ImageContainer>
                <CaptionContainer>
                    <Caption>{attachment.file.name}</Caption>
                </CaptionContainer>
            </Container>
            <Modal 
                title={attachment.file.name}
                content={
                    <Stack alignItems="center">
                        {image}
                        {isImage ? null : <Typography fontStyle="italic" >(No preview available)</Typography>}
                    </Stack>
                }
                open={showPreview}
                onClose={() => setShowPreview(false)}
            />
        </>
    );
}

export default Attachment;