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
import React, {useEffect, useState} from 'react';
import '../../css/olog.css';
import Select from 'react-select';

/**
 * Component to show list of available logbooks and maintain selection of logbooks
 * to include in a search query.
 */
const Logbooks = ({logbooks, searchParams, updateLogbookSearchCriteria, inputId}) => {

    const [selection, setSelection] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        if(logbooks) {
            setOptions(logbooks.map(logbook => {
                return {
                    value: logbook,
                    label: logbook.name
                }
            }));
        }
    }, [logbooks]);

    useEffect(() => {
        
        // if search params and logbook search params are set, then set selection
        if(searchParams && searchParams.logbooks) {
            // push the single string value, or the array of strings
            const logbooks = [];
            if(Array.isArray(searchParams.logbooks)) {
                logbooks.push(...searchParams.logbooks);
            } else {
                logbooks.push(searchParams.logbooks);
            }
            const newSelection = options.filter(it => logbooks.includes(it.value.name));
            setSelection(newSelection);
        } 
        // else clear the selection
        else {
            setSelection([]);
        }
    }, [searchParams, options]);

    const logbookSelectionChanged = (updatedSelection) => {
        setSelection(updatedSelection);
        const logbooks = Object.values(updatedSelection).map(it => it.value).map(it => it.name);
        updateLogbookSearchCriteria(logbooks);
    }

    return <Select
        isMulti
        name={inputId}
        inputId={inputId}
        options={options}
        onChange={logbookSelectionChanged}
        value={selection}
    />
    
}

export default Logbooks