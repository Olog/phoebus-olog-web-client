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
 import Table from 'react-bootstrap/Table';
 import Button from 'react-bootstrap/Button';
 
 const PropertySelector = (props) => {

    const isAlreadySelected = (propertyName) => {
        return props.selectedProperties.filter(prop => prop.name === propertyName).length > 0;
    }

    const addProperty = (property) => {
        props.addProperty(property)
    };

    var rows = props.availableProperties.map((row, index) => {
        if(!isAlreadySelected(row.name)){
            return <tr key={index}><td>{row.name}</td><td><Button 
                style={{float: "right"}}
                onClick={() => addProperty(row)}>Add</Button></td></tr>;
        }
        else{
            return <tr key={index}></tr>;
        }
    });
        
    
    return(
            <>
                <Table size="sm">
                    <tbody>
                    {rows}
                    </tbody>
                </Table>
            </>
        )
    }

 export default PropertySelector;