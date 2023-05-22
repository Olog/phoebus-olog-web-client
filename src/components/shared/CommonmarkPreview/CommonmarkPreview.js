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

import React, { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import imageProcessor from 'utils/image-processor';
import styled from 'styled-components';
import HtmlContent from './HtmlContent';

const StyledHtmlContent = styled(HtmlContent)`
    padding: 0.5rem 0;
    width: 100%;
`

/**
 * Renders and HTML preview of CommonMark markup, with support for embedded images
 * @param {string} commonmarkSrc commonmark markup
 * @param {OlogAttachment[]} attachedFiles List of OlogAttachments (file objects with unique ids)
 * @param {string} [imageUrlPrefix=http://your-server.domain/path/to/images] Prefix attached to 
 * attachedFile urls; ignored if there are no file objects.
 * @returns 
 */
export const CommonmarkPreview = ({commonmarkSrc, attachedFiles, imageUrlPrefix}) => {
    
    const [innerHtml, setInnerHtml] = useState("");
    
    const remarkable = useMemo(() => new Remarkable('full', {
        html:         false,        // Enable HTML tags in source
        xhtmlOut:     false,        // Use '/' to close single tags (<br />)
        breaks:       false,        // Convert '\n' in paragraphs into <br>
        langPrefix:   'language-',  // CSS language prefix for fenced blocks
        linkTarget:   '',           // set target to open link in
        typographer:  false,        // Enable some language-neutral replacements + quotes beautification
    }), []);

    useEffect(() => {
        remarkable.use(imageProcessor, {
            attachedFiles, 
            setHtmlPreview: attachedFiles && attachedFiles.length > 0, 
            urlPrefix: imageUrlPrefix
        });
        setInnerHtml(remarkable.render(commonmarkSrc));
    }, [commonmarkSrc, attachedFiles, imageUrlPrefix, remarkable])

    return(
        <StyledHtmlContent html={{ __html: innerHtml }} /> 
    )

}