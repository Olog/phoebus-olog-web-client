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

/**
 * Simple wrapper for a File object and a (pre-defined) id. The use case is when
 * adding an embedded image into the body/description markup: a unique id must be
 * determined at that point and later referenced when uploading the attachment.
 */
export default class OlogAttachment {
  file; // File
  id; // String
  filename; // String
  fileMetadataDescription; // String
  constructor(file, id) {
    this.file = file;
    this.id = id;
    this.filename = file.name;
    if (file?.type?.startsWith("image")) {
      this.fileMetadataDescription = "image";
    } else {
      this.fileMetadataDescription = "file";
    }
  }
}
