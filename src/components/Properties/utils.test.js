const { getLogEntryGroupId } = require("./utils");

test("getLogEntryGroup", () => {
  let logEntry = {
    properties: [
      {
        name: "Log Entry Group",
        attributes: [{ name: "id", value: "myLogEntryGroupId" }]
      }
    ]
  };
  let result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBe("myLogEntryGroupId");
});

test("getLogEntryGroupNoMatch", () => {
  let logEntry = {
    properties: [
      {
        name: "not a log entry group",
        attributes: [{ name: "id", value: "myLogEntryGroupId" }]
      }
    ]
  };
  let result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();

  logEntry = {
    properties: [
      {
        name: "Log Entry Group",
        attributes: [{ name: "not an id", value: "myLogEntryGroupId" }]
      }
    ]
  };
  result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();
});

test("getLogEntryGroupMissing", () => {
  let logEntry = {
    properties: [
      {
        name: "Not Log Entry Group",
        attributes: [{ name: "id", value: "myLogEntryGroupId" }]
      }
    ]
  };
  let result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();

  logEntry = {
    properties: [{ name: "Log Entry Group" }]
  };
  result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();

  logEntry = {
    properties: [{ name: "Log Entry Group", attributes: [] }]
  };
  result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();

  logEntry = {
    properties: [
      {
        name: "Log Entry Group",
        attributes: [{ name: "not id", value: "myLogEntryGroupId" }]
      }
    ]
  };
  result = getLogEntryGroupId(logEntry.properties);
  expect(result).toBeNull();
});
