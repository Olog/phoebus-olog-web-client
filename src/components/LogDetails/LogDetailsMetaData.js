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
import customization from 'config/customization';
import styled from 'styled-components';
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import FormattedDate from 'components/shared/FormattedDate';

const Key = styled(Typography)({
    textAlign: "right",
    "&, & *": {
        fontSize: "0.8rem"
    }
});

const Value = styled(Typography)({
    fontWeight: "bold",
    "&, & *": {
        fontSize: "0.8rem"
    }
});

const CommaSeparatedList = ({list}) => {
    if(list && list.length > 0) {
        return (
            <Typography component="span" fontWeight="inherit">
                {
                    list.join(", ")
                }
            </Typography>
        )
    }

    return null;
}

const LogDetailsMetaData = ({currentLogRecord}) => {        
    
    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "max-content auto",
                columnGap: 1,
                justifyContent: "flex-start",
            }}
        >
            <Key>Author</Key>
            <Value data-testid="meta-author">{currentLogRecord.owner}</Value>
            <Key>Created</Key>
            <Value data-testid="meta-created">
                <FormattedDate 
                    date={currentLogRecord.modifyDate ? currentLogRecord.modifyDate : currentLogRecord.createdDate} 
                    fontWeight="inherit"
                />
                {" "}
                {currentLogRecord.modifyDate ? <Link component={RouterLink} to={`/logs/${currentLogRecord.id}/history`}>(edited)</Link> : null}
            </Value>
            <Key>Logbooks</Key>
            <Value data-testid="meta-logbooks">
                <CommaSeparatedList list={
                    currentLogRecord?.logbooks
                    ?.toSorted((a, b) => a.name.localeCompare(b.name))
                    ?.map(it => it.name)
                } />
            </Value>
            <Key>Tags</Key>
            <Value data-testid="meta-tags">
                <CommaSeparatedList list={
                    currentLogRecord?.tags
                    ?.toSorted((a, b) => a.name.localeCompare(b.name))
                    ?.map(it => it.name)
                } />
            </Value>
            <Key>{customization.level}</Key>
            <Value data-testid="meta-entrytype">{currentLogRecord.level}</Value>
        </Box>
    );

}

export default LogDetailsMetaData;