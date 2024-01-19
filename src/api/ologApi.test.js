import { hasSameProperties, removeEmptyKeys } from "./ologApi";

describe("removeEmtpyKeys util", () => {

    test("Empty lists are removed", () => {
    
        const result = removeEmptyKeys({
            foo: ["bar"],
            baz: []
        })
    
        expect(result).toEqual({
            foo: ["bar"]
        })
    
    });
    
    test("empty strings are removed", () => {
    
        const result = removeEmptyKeys({
            foo: "bar",
            baz: ""
        })
    
        expect(result).toEqual({
            foo: "bar"
        })
        
    });
    
    test("null and undefined values are removed", () => {
    
        const result = removeEmptyKeys({
            foo: "bar",
            baz: null,
            phooey: undefined
        })
    
        expect(result).toEqual({
            foo: "bar"
        })
    
    });
    
    test("exceptions are excluded", () => {
    
        const result = removeEmptyKeys({
            foo: "bar",
            baz: null,
            phooey: undefined,
            whamo: []
        }, ["baz", "phooey", "whamo"]);
    
        expect(result).toEqual({
            foo: "bar",
            baz: null,
            phooey: undefined,
            whamo: []
        })
    
    });
    
});

describe("comparing logbook properties", () => {

    const emptyProperty = {
        name: null,
        owner: null,
        state: "Active", 
        attributes: []
    };
    
    const emptyAttribute = {
        name: null,
        value: null,
        state: "Active"
    };

    const attr = (name, value) => {
        return {
            ...emptyAttribute,
            name,
            value: value ?? name + " value"
        }
    }

    it("should consider logbooks with no properties equal", () => {

        const noProps1 = { }
        const noProps2 = { }
        expect(hasSameProperties(noProps1, noProps2)).toBe(true);

        const emptyProps1 = { properties: []}
        const emptyProps2 = { properties: []}
        expect(hasSameProperties(emptyProps1, emptyProps2)).toBe(true);

        const nullProps1 = { properties: null}
        const nullProps2 = { properties: null}
        expect(hasSameProperties(nullProps1, nullProps2)).toBe(true);


        const undefinedProps1 = { properties: null}
        const undefinedProps2 = { properties: null}
        expect(hasSameProperties(undefinedProps1, undefinedProps2)).toBe(true);

    });

    it("should consider logbooks with the exact same properties, in order, no attributes the same", () => {

        const noAttributes1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1"
                },
                {
                    ...emptyProperty,
                    name: "prop2"
                },
            ]
        }
        const noAttributes2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1"
                },
                {
                    ...emptyProperty,
                    name: "prop2"
                },
            ]
        }
        expect(hasSameProperties(noAttributes1, noAttributes2)).toBe(true);

        const nullAttributes1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: null
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: null
                },
            ]
        }
        const nullAttributes2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: null
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: null
                },
            ]
        }
        expect(hasSameProperties(nullAttributes1, nullAttributes2)).toBe(true);

        const undefinedAttributes1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: undefined
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: undefined
                },
            ]
        }
        const undefinedAttributes2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: undefined
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: undefined
                },
            ]
        }
        expect(hasSameProperties(undefinedAttributes1, undefinedAttributes2)).toBe(true);

        const empty1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: []
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: []
                },
            ]
        }
        const empty2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: []
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: []
                },
            ]
        }
        expect(hasSameProperties(empty1, empty2)).toBe(true);

    });

    it("should consider logbooks with the exact same properties, in order, with attributes the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute 1"),
                        attr("attribute 2"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute 1"),
                    ]
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute 1"),
                        attr("attribute 2"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute 1"),
                    ]
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(true);

    });

    it("should consider logbooks with the exact same properties in different order the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1")
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute1"),
                        attr("attribute2"),
                    ]
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute1"),
                        attr("attribute2"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1"),
                    ]
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(true);

    });

    it("should consider logbooks with the exact same properties and attributes in different order the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute1"),
                        attr("attribute2"),
                    ]
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute2"),
                        attr("attribute1"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1"),
                    ]
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(true);

    });

    it("should consider logbooks with the same properties different attributes not the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute1"),
                        attr("attribute2"),
                    ]
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                    attributes: [
                        attr("attribute1"),
                    ]
                },
                {
                    ...emptyProperty,
                    name: "prop1",
                    attributes: [
                        attr("attribute1"),
                        attr("attribute2", "somethingdifferent"),
                    ]
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(false);

    });

    it("should consider logbooks with the different numbers of properties not the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                },
                {
                    ...emptyProperty,
                    name: "prop1",
                },
                {
                    ...emptyProperty,
                    name: "prop3",
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(false);

    });

    it("should consider logbooks with the same count but different properties not the same", () => {

        const log1 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop2",
                },
                {
                    ...emptyProperty,
                    name: "prop3",
                },
            ]
        }
        const log2 = { 
            properties: [
                {
                    ...emptyProperty,
                    name: "prop1",
                },
                {
                    ...emptyProperty,
                    name: "prop2",
                },
            ]
        }
        expect(hasSameProperties(log1, log2)).toBe(false);

    });

})