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
import { Stack, Tooltip, Typography, styled } from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EditIcon from "@mui/icons-material/Edit";
import { getLogEntryGroupId } from "components/Properties/utils";
import { FormattedDate } from "components/shared/FormattedDate";

const LogInfo = styled("div")`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
`;

const SearchResultItem = ({ log }) => {
  const isGroupEntry = getLogEntryGroupId(log.properties);

  const formatDescription = (description) => {
    let length = 75;
    if (!description) {
      return "";
    }
    let ellipsis = description.length > length ? "..." : "";
    return description.substring(0, length) + ellipsis;
  };

  return (
    <Stack width="100%">
      <Stack
        flexDirection="row"
        justifyContent="space-between"
      >
        <Tooltip title={log.title}>
          <Typography
            variant="body1"
            component="h3"
            noWrap
            textOverflow="ellipsis"
          >
            {log.title}
          </Typography>
        </Tooltip>
        <Stack flexDirection="row">
          {isGroupEntry ? (
            <ReplyIcon
              titleAccess="has replies"
              role="status"
            />
          ) : null}
          {log.attachments && log.attachments.length !== 0 ? (
            <AttachFileIcon
              titleAccess="has attachments"
              role="status"
            />
          ) : null}
          {log.modifyDate ? <EditIcon titleAccess="has edits" /> : null}
        </Stack>
      </Stack>
      <LogInfo>
        <Typography fontSize="0.75rem">{log.owner}</Typography>
        <FormattedDate
          fontSize="0.75rem"
          date={log.createdDate}
        />
      </LogInfo>
      <LogInfo>
        <Typography fontSize="0.75rem">
          {formatDescription(log.description)}
        </Typography>
        <Typography fontSize="0.75rem">{log.id}</Typography>
      </LogInfo>
    </Stack>
  );
};

export default SearchResultItem;
