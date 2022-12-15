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
import Button from '../shared/Button';
import { FaRegFile } from "react-icons/fa";
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`;

const ImageContainer = styled.div`
    height: 20vh;
    width: 20vw;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
`

const Image = styled.img`
    width: 20vw;
`

const FileIcon = styled(FaRegFile)`
    filter: opacity(40%);
`

const Caption = styled.figcaption`
    font-style: italic;
    text-align: center;
`

const Attachment = ({attachment, removeAttachment}) => {

    const image = attachment?.file?.type?.toLowerCase()?.startsWith("image") 
        ? <Image src={URL.createObjectURL(attachment.file)} alt={attachment.file.name} />
        : <FileIcon size={'90%'}/>;
    
    return (
        <Container>
            <Button variant="danger" onClick={() => removeAttachment(attachment.file)}>Remove</Button>
            <ImageContainer>
                {image}
            </ImageContainer>
            <Caption>{attachment.file.name}</Caption>
        </Container>)
    ;
}

export default Attachment;