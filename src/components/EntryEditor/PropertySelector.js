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
import styled from 'styled-components';
import Button from '../common/Button';
 
const Table = styled.table`

`

const TableBody = styled.tbody`

`

const TableRow = styled.tr`

`

const TableData = styled.td`

`

const PropertySelector = ({selectedProperties, availableProperties, addProperty}) => {

    const isAlreadySelected = (propertyName) => {
        return selectedProperties.filter(prop => prop.name === propertyName).length > 0;
    }

    var rows = availableProperties.map((row, index) => {
        if(!isAlreadySelected(row.name)){
            return (
                <TableRow key={index}>
                    <TableData>{row.name}</TableData>
                    <TableData>
                        <Button 
                            variant='primary'
                            onClick={() => addProperty(row)}
                        >
                            Add
                        </Button>
                    </TableData>
                </TableRow>
            );
        }
        else{
            return <TableRow key={index}></TableRow>;
        }
    });
        
    
    return(
        <Table>
            <TableBody>
                {rows}
            </TableBody>
        </Table>   
    )
}

export default PropertySelector;