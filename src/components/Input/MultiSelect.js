import React, {useEffect, useState} from 'react';
import '../../css/olog.css';
import Select from 'react-select';

const MultiSelect = ({inputId, selection=[], options=[], onSelectionChanged, isMulti=true}) => {

    // const [remainingOptions, setRemainingOptions] = useState([]);

    // // Initialize or update the remaining options
    // useEffect(() => {
    //     setRemainingOptions();
    // }, [remainingOptions, options, selection]);

    console.log({selection, options})

    return <Select
        isMulti={isMulti}
        name={inputId}
        inputId={inputId}
        options={options.filter(option => 
            !selection.map(it => it.label).includes(option.label)
        )}
        onChange={onSelectionChanged}
        value={selection}
    />
    
}


export default MultiSelect;