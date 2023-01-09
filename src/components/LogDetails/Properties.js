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
import styled from 'styled-components';
import Collapse from 'components/shared/Collapse';

const StyledCollapse = styled(Collapse)`
    padding-left: 1rem;
`

const Container = styled.div`
    & > *:nth-child(2n) {
        background-color: ${({theme}) => theme.colors.light};
    }
`

const Attribute = styled.div`
    display: flex;
    gap: 0.5rem;
`

const AttributeKey = styled.div`
    font-weight: bold;
    min-width: 3.5rem;
    text-align: right;
`

const AttributeValue = styled.div`
    font-style: italic;
`

const Properties = ({property}) => {
    
    const renderedProperties = property.attributes.map((a, index) => (
        <Attribute key={index}>
            <AttributeKey>{a.name}:</AttributeKey>
            <AttributeValue>{a.value}</AttributeValue>
        </Attribute>
    ))

    return(
        <StyledCollapse active={true} title={property.name} >
            <Container>
                {renderedProperties}
            </Container>
        </StyledCollapse>
    )
}

export default Properties;