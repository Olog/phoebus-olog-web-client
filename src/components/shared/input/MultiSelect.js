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

// import '../../css/olog.css';
import Select from 'react-select';
import { useController } from 'react-hook-form';
import LabeledInput from './LabeledInput';

const MultiSelect = ({name, label, control, rules, defaultValue, className, options=[], onSelection, onSelectionChanged, isMulti=true}) => {
    const {field, fieldState} = useController({name, control, rules, defaultValue});

    return (
        <LabeledInput {...{name, label, error: fieldState?.error?.message}} >
            <Select
                name={name}
                inputId={name}
                isMulti={isMulti}
                placeholder={label}
                options={options.filter(option => 
                    ![...field.value].map(it => it.label).includes(option.label)
                )}
                onChange={value => onSelectionChanged(field, value)}
                value={onSelection(field.value)}
                className={className}
            />
        </LabeledInput>
   )
    
}

export default MultiSelect;