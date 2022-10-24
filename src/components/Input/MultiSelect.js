import '../../css/olog.css';
import Select from 'react-select';

const MultiSelect = ({inputId, selection=[], options=[], onSelectionChanged, isMulti=true, className, placeholder}) => {

    return <Select
        isMulti={isMulti}
        name={inputId}
        inputId={inputId}
        options={options.filter(option => 
            !selection.map(it => it.label).includes(option.label)
        )}
        onChange={onSelectionChanged}
        value={selection}
        className={className}
        placeholder={placeholder}
    />
    
}

export default MultiSelect;