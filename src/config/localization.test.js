const { dateToString } = require("./localization");

test('dateToString', () => {
    let now = new Date();
    let string = dateToString(now);
    expect(string.length).toBe(19);
})