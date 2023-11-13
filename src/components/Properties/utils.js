import { v4 as uuidv4 } from 'uuid';

/**
 * Checks if a log entry contains the special purpose property "Log Entry Group" and returns
 * its id attribute value if it does. Otherwise returns null.
 * @param {*} logEntry 
 */
export function getLogEntryGroupId(properties){
    if(!properties || properties.length === 0){
        return null;
    }
    for(let i = 0; i < properties.length; i++){
        if(properties[i].name === 'Log Entry Group'){
            if(!properties[i].attributes || properties[i].attributes.length === 0){
                return null;
            }
            for(let j = 0; j < properties[i].attributes.length; j++){
                if(properties[i].attributes[j].name === 'id'){
                    return properties[i].attributes[j].value;
                }
            }
        }
    };
    return null;
}

/**
 * Creates a new Log Entry Group property with an UUID id attribute value.
 */
export function newLogEntryGroup(){
    return {
        name : "Log Entry Group",
        attributes: [
            {
                name: "id",
                value: uuidv4()
            }
        ]
    }
}