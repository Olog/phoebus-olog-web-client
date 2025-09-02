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

import packageInfo from "../../package.json";

let customization = {
  NAME: packageInfo.name,
  /**
   * The name of the "level" (legacy name) meta data field.
   */
  level: "Entry Type",
  /**
   * Specifies whether to support grouping of log entries.
   */
  log_entry_groups_support: true,

  /**
   * Specifies whether to support editing of log entries.
   */
  log_edit_support: true,

  /**
   * Default search params
   */
  defaultSearchParams: { start: "", end: "" },
  defaultSortDirection: "down",

  /**
   * Default page size in search
   */
  defaultRowsPerPageOptions: [10, 30, 50],
  defaultPageSize: 50,

  /**
   * Max total attachment upload size and individual file size (MB)
   */
  defaultMaxRequestSizeMb: 100,
  defaultMaxFileSizeMb: 50,

  /**
   * Base URL pointing to the Olog service. Required in order to support imbedded into the description (body) of a log entry.
   */
  APP_BASE_URL: import.meta.env.VITE_APP_BASE_URL, // e.g. http://localhost:8080/Olog

  /**
   * Base URL for the websocket connection to the Olog service.
   */
  WEBSOCKET_BASE_URL: import.meta.env.VITE_APP_WEBSOCKET_BASE_URL, // e.g. ws://localhost:8080/Olog/web-socket

  /**
   * Support and Docs URLs for Help page
   */
  DOCS_HREF:
    import.meta.env.VITE_APP_DOCS_HREF ??
    "https://olog.readthedocs.io/en/latest/",
  SUPPORT_HREF: import.meta.env.VITE_APP_SUPPORT_HREF,
  VERSION: import.meta.env.VITE_APP_VERSION ?? packageInfo.version,
  VERSION_HREF: import.meta.env.VITE_APP_VERSION_HREF
};

export default customization;
