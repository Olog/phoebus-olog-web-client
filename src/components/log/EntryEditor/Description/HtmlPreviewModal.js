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

import React from 'react';
import Modal from '../../../shared/Modal';
import CommonmarkPreview from '../../../shared/CommonmarkPreview';
import customization from 'config/customization';

const HtmlPreviewModal = ({commonmarkSrc, attachedFiles, showHtmlPreview, setShowHtmlPreview, useRemoteAttachments}) => { 

    const CommonmarkPreviewArgs = {
        commonmarkSrc
    }

    // If using remote attachments (e.g. editing an existing entry)
    // then set the prefix and don't include any files (there aren't any!)
    if(useRemoteAttachments) {
        CommonmarkPreviewArgs.imageUrlPrefix = customization.APP_BASE_URL + "/";
    } 
    // Otherwise, use the attached files that should exist
    else {
        CommonmarkPreviewArgs.attachedFiles = attachedFiles;
    }

    return (
        <Modal
            open={showHtmlPreview}
            onClose={() => setShowHtmlPreview(false)}
            title="Description Preview"
            content={<CommonmarkPreview {...CommonmarkPreviewArgs} />}
            DialogProps={{
                fullWidth: true,
                maxWidth: "lg"
            }}
        />
    )
}

export default HtmlPreviewModal;
