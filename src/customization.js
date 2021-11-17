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

export default {
    /**
     * The name of the "level" (legacy name) meta data field.
     */
    level: "Entry Type",
    /**
     * Values for the "level" drop-down.
     */
    levelValues: "Normal, Shift Start, Shift End, Fault, Beam Loss, Beam Configuration, Crew, Expert Intervention Call",

    /**
     * Default "level" for new log entries
     */
    defaultLevel: "Normal",
    /**
     * Base URL pointing to the Olog service. Required in order to support imbedded into the description (body) of a log entry.
     */
    urlPrefix: `${process.env.REACT_APP_BASE_URL}/`,
    /**
     * Specifies whether to support grouping of log entries.
     */
    log_entry_groups_support: true,

    /**
     * Default search params
     */
    defaultSearchParams: {start: "12 hours", end: "now"}
}