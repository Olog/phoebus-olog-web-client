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

import { Box, Typography, styled } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import customization from "config/customization";
import { FormattedDate } from "components/shared/FormattedDate";
import { InternalLink } from "components/shared/Link";

const Key = styled(Typography)({
  textAlign: "right"
});

const Value = styled(Typography)({
  fontWeight: "bold"
});

const CommaSeparatedList = ({ list }) => {
  if (list && list.length > 0) {
    return (
      <Typography
        component="span"
        fontWeight="inherit"
      >
        {list.join(", ")}
      </Typography>
    );
  }

  return null;
};

const LogDetailsMetaData = ({ currentLogRecord }) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "max-content auto",
        columnGap: 1,
        justifyContent: "flex-start"
      }}
    >
      <Key>Author</Key>
      <Value data-testid="meta-author">{currentLogRecord.owner}</Value>
      <Key>Created</Key>
      <Value data-testid="meta-created">
        <FormattedDate
          date={currentLogRecord.createdDate}
          fontWeight="inherit"
        />
        {currentLogRecord.modifyDate ? (
          <Typography
            component="span"
            fontStyle="italic"
          >
            {" "}
            <InternalLink
              to={`/logs/${currentLogRecord.id}/history`}
              label={`View log history for ${currentLogRecord.title}`}
            >
              <EditIcon
                fontSize="small"
                sx={{ verticalAlign: "text-top" }}
              />
              view history
            </InternalLink>
          </Typography>
        ) : null}
      </Value>
      <Key>Logbooks</Key>
      <Value data-testid="meta-logbooks">
        <CommaSeparatedList
          list={currentLogRecord?.logbooks
            ?.toSorted((a, b) => a.name.localeCompare(b.name))
            ?.map((it) => it.name)}
        />
      </Value>
      <Key>Tags</Key>
      <Value data-testid="meta-tags">
        <CommaSeparatedList
          list={currentLogRecord?.tags
            ?.toSorted((a, b) => a.name.localeCompare(b.name))
            ?.map((it) => it.name)}
        />
      </Value>
      <Key>{customization.level}</Key>
      <Value data-testid="meta-entrytype">{currentLogRecord.level}</Value>
    </Box>
  );
};

export default LogDetailsMetaData;
