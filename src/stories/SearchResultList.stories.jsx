import { Paper } from "@mui/material";
import dayjs from "dayjs";
import { http, HttpResponse, delay } from "msw";
import { SearchResultGroupItem } from "components/search/SearchResultList/SearchResultGroupItem";
import { SearchResultList } from "components/search/SearchResultList";
import {
  attachment,
  attribute,
  group,
  log,
  logbook,
  property,
  tag
} from "mocks/fixtures/generators";
import { sbDisabledArg } from "stories/sb-utils";

export default {
  title: "SearchResultList"
};

let createdDate = dayjs();
const replyGroup = group({});
const log0 = {
  id: 0,
  title: "Setup for experiment",
  source: "# Summary\nThe experiment was setup",
  description: "Summary\nThe experiment was setup",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [logbook({ name: "experiments" })],
  tags: [tag({ name: "setup" })],
  properties: [
    property({
      name: "contact",
      attributes: [attribute({ name: "email", value: "bhoneydew@muppet.fuzz" })]
    })
  ]
};
createdDate = createdDate.add(1, "day");
const log1 = log({
  id: 1,
  title: "An interesting observation 1",
  source:
    "# Well this is interesting\n## Why\nBecause it seems cool\n## What\nSomething happened!\n1. a\n1. b\n1. c",
  description:
    "Well this is interesting\nWhy\nBecause it seems cool\nWhat\nSomething happened!\n1. a\n2. b\n3. c",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [logbook({ name: "experiments" })],
  tags: [
    tag({ name: "interesting" }),
    tag({ name: "discovery" }),
    tag({ name: "something" })
  ],
  properties: [
    property({
      name: "contact",
      attributes: [attribute({ name: "email", value: "bhoneydew@muppet.fuzz" })]
    }),
    replyGroup
  ]
});
createdDate = createdDate.add(5, "minutes");
const log2 = {
  ...log1,
  title: "An interesting observation 2",
  id: 2,
  source: "#meep!",
  description: "meep!",
  owner: "beaker",
  level: "Incident",
  tags: [tag({ name: "boom" })],
  createdDate: createdDate.valueOf(),
  attachments: [attachment({ filename: "results.jpeg" })]
};
createdDate = createdDate.add(1, "minute");
const log3 = {
  ...log1,
  title: "An interesting observation 3",
  id: 3,
  source: "you okay?!",
  description: "you okay?!",
  owner: "bhoneydew",
  level: "Incident",
  tags: [tag({ name: "boom" })],
  createdDate: createdDate.valueOf()
};
createdDate = createdDate.add(6, "minutes");
const log4 = {
  ...log1,
  title: "An interesting observation 3 (resolution)",
  id: 4,
  source: "meep! All is well now",
  description: "meep! All is well now",
  owner: "beaker",
  level: "Incident",
  tags: [tag({ name: "resolution" })],
  createdDate: createdDate.valueOf()
};
createdDate = createdDate.add(1, "day");
const log5 = {
  id: 5,
  title: "The experiment is now a spectacular long-winded success!",
  source:
    "# Summary\nThe experiment succeeded\n## What Now\nTime to celebrate!\n1. Gather colleagues\n1. Celebrate\n1. Do more science",
  description:
    "Summary\nThe experiment succeeded\nWhat Now\nTime to celebrate!\n1. Gather colleagues\n1. Celebrate\n1. Do more science",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [
    logbook({ name: "experiments" }),
    logbook({ name: "party-commitee" })
  ],
  tags: [tag({ name: "success" }), tag({ name: "discovery" })],
  properties: [
    property({
      name: "contact",
      attributes: [attribute({ name: "email", value: "bhoneydew@muppet.fuzz" })]
    })
  ],
  attachments: [attachment({ filename: "paper.pdf" })]
};

const SearchResultListTemplate = ({ ...props }) => {
  const onRowClick = (log) => {
    console.debug({ clicked: log });
  };

  return (
    <Paper
      sx={{
        width: "40%",
        minHeight: "90vh"
      }}
    >
      <SearchResultList
        onRowClick={onRowClick}
        {...props}
      />
    </Paper>
  );
};
export const Default = (args) => <SearchResultListTemplate {...args} />;
Default.args = {
  logs: [log0, log1, log2, log3, log4, log5],
  dateDescending: true,
  selectedId: 1
};
Default.argTypes = {
  logs: {
    ...sbDisabledArg
  }
};
Default.parameters = {
  msw: {
    handlers: [
      http.get("**/logs?properties=Log*", async () => {
        // Add delay if needed
        await delay();
        return HttpResponse.json([...replies]);
      })
    ]
  }
};

const ReplyItemTemplate = ({ ...props }) => {
  const onClick = (log) => {
    console.debug({ clicked: log });
  };

  return (
    <SearchResultGroupItem
      onClick={onClick}
      {...props}
    />
  );
};
const replies = [log1, log2, log3, log4]; // BE replies are a flat group that includes the "parent"

export const ReplyItem = (args) => <ReplyItemTemplate {...args} />;
ReplyItem.args = {
  log: log2,
  dateDescending: true,
  selectedId: 1
};
ReplyItem.argTypes = {
  log: {
    ...sbDisabledArg
  }
};
ReplyItem.parameters = { ...Default.parameters };

export const ReplyItemError = (args) => <ReplyItemTemplate {...args} />;
ReplyItemError.args = { ...ReplyItem.args };
ReplyItemError.parameters = {
  msw: {
    handlers: [
      http.get("**/logs?properties=Log*", async () => {
        // Add delay
        await delay();
        // Return 400 status
        return HttpResponse.json(null, { status: 400 });
      })
    ]
  }
};
