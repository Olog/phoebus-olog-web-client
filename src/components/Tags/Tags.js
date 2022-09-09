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
import React, {useState, useEffect} from 'react'
import '../../css/olog.css';
import Select from 'react-select';

const Tags = ({tags, searchParams, updateTagSearchCriteria, inputId}) => {

    const [selection, setSelection] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if(tags) {
            setOptions(tags.map(tag => {
                return {
                    value: tag,
                    label: tag.name
                }
            }));
        }
    }, [tags]);

    useEffect(() => {
        
        // if search params and tag search params are set, then set selection
        if(searchParams && searchParams.tags) {
            // push the single string value, or the array of strings
            const tags = [];
            if(Array.isArray(searchParams.tags)) {
                tags.push(...searchParams.tags);
            } else {
                tags.push(searchParams.tags);
            }
            const newSelection = options.filter(it => tags.includes(it.value.name));
            setSelection(newSelection);
        } 
        // else clear the selection
        else {
            setSelection([]);
        }
    }, [searchParams, options]);

    const tagSelectionChanged = (updatedSelection) => {
        setSelection(updatedSelection);
        const tags = Object.values(updatedSelection).map(it => it.value).map(it => it.name);
        updateTagSearchCriteria(tags);
    }

    return <Select
        isMulti
        name={inputId}
        inputId={inputId}
        options={options}
        onChange={tagSelectionChanged}
        value={selection}
    />
    
}

export default Tags;