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
import {BsXCircle} from 'react-icons/bs';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
    padding: 0.5rem;
    width: 100%;
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const Body = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.5rem 0.25rem;
    align-items: center;
`

const PropertyEditorLabel = styled.label`
    text-align: right;
    min-width: 50%;
`

const PropertyEditorInput = styled.input`
    padding: 0.25rem 0.5rem;
    border: solid 1px ${({theme}) => theme.colors.light};
    border-radius: 5px;
`

const PropertyEditor = ({index, property, removeProperty, updateAttributeValue}) => {

    const updateValue = (event, attribute) => {
        updateAttributeValue(index, property, attribute, event.target.value);
    }

    const renderedAttributeRows = property.attributes.map((attribute, index) => {
        const uniqueName = `row-${index}-${attribute.name}`;
        return (
            <React.Fragment key={uniqueName}>
                <PropertyEditorLabel htmlFor={uniqueName}>{attribute.name}</PropertyEditorLabel>
                <PropertyEditorInput 
                    type='text' 
                    defaultValue={attribute.value}
                    onChange={(e) => updateValue(e, attribute)}
                    id={uniqueName}
                    name={uniqueName}
                />
            </React.Fragment>
        )
    });

    return(
        <Container>
            <Header>
                <h3>{property.name}</h3>
                <BsXCircle onClick={() => removeProperty(property)} />
            </Header>
            <Body>
                {renderedAttributeRows}
            </Body>
        </Container>
    )
    
}

export default PropertyEditor;