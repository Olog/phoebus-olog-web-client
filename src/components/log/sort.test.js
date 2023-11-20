import moment from "moment";
import { sortLogsDateCreated } from "./sort";

test("sortLogsDateCreatedDescending", () => {
  let searchResult = [];
  let date1 = moment().toDate();
  searchResult.push({ id: "1", createdDate: date1 });
  let date2 = moment().subtract(2, "days").toDate();
  searchResult.push({ id: "2", createdDate: date2 });

  let result = sortLogsDateCreated(searchResult, true);
  expect(result[0].id).toBe("1");
  expect(result.length).toBe(2);
});

test("sortLogsDateCreatedAscending", () => {
  let searchResult = [];
  let date1 = moment().toDate();
  searchResult.push({ id: "1", createdDate: date1 });
  let date2 = moment().subtract(2, "days").toDate();
  searchResult.push({ id: "2", createdDate: date2 });

  let result = sortLogsDateCreated(searchResult, false);
  expect(result[0].id).toBe("2");
  expect(result.length).toBe(2);
});
