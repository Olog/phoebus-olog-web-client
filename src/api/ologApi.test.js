import { removeEmptyKeys } from "./ologApi";

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