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
import customization from "config/customization";

/**
 * Simple wrapper for a File object and a (pre-defined) id. The use case is when
 * adding an embedded image into the body/description markup: a unique id must be
 * determined at that point and later referenced when uploading the attachment.
 */
export default class OlogAttachment{
    file;
    id;
    filename;
    fileMetadataDescription;
    isImage = false;
    url;
    constructor({attachment, file, id}){
        // Is a remote attachment from an existing log entry
        if(attachment) {
            this.id = attachment.id;
            this.filename = attachment.filename;
            this.fileMetadataDescription = attachment.fileMetadataDescription;
            this.url = `${customization.APP_BASE_URL}/attachment/${attachment.id}`
        } 
        // Otherwise it is local to the browser / in the editor
        else {
            this.file = file;
            this.id = id;
            this.filename = file.name
            if(file?.type?.startsWith("image")) {
                this.fileMetadataDescription = "image";
            } else {
                this.fileMetadataDescription = "file";
            }
            this.url = URL.createObjectURL(file);
        }   
        if(this.fileMetadataDescription?.toLowerCase()?.startsWith("image")) {
            this.isImage = true;
        }
    }
 }