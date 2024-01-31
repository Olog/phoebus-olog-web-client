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
import React from 'react';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PropertySelector = ({selectedProperties, availableProperties, addProperty}) => {

    const isAlreadySelected = (propertyName) => {
        return selectedProperties.filter(prop => prop.name === propertyName).length > 0;
    }

    const rows = availableProperties.filter(property => !isAlreadySelected(property.name)).map( property => 
        <Paper 
            key={property.name} 
            component={Stack}
            variant="outlined"
            padding={1}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
        >
            <Box>
                <Typography>{property.name}</Typography>
                <Stack 
                    flexDirection="row"
                    gap={0.5}
                >
                    {
                        property?.attributes?.map(attr => <Chip label={attr.name} size="small" />)
                    }
                </Stack>
            </Box>
            <Button 
                variant="contained"
                onClick={() => addProperty(property)}
                aria-label={`Add ${property.name}`}
                startIcon={<AddIcon />}
            >
                Add
            </Button>
        </Paper>
    );
    
    return(
        <Stack gap={1}>
            {rows}
        </Stack>
    )
}

export default PropertySelector;