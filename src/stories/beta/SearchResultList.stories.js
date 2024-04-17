import { Box, Paper } from "@mui/material";
import { SearchResultGroupItem } from "beta/components/search/SearchResultTreeList/SearchResultGroupItem";
import { SearchResultTreeList } from "beta/components/search/SearchResultTreeList"
import { attachment, attribute, group, log, logbook, property, tag } from "mocks/fixtures/generators";
import moment from "moment/moment";
import { rest } from "msw";

export default {
  title: "beta/SearchResultList"
}

let createdDate = moment();
const replyGroup = group({});
const log0 = {
  id: 0,
  title: "Setup for experiment",
  source: "# Summary\nThe experiment was setup",
  description: "Summary\nThe experiment was setup",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [logbook({name: "instruments"})],
  tags: [tag({name: "setup"})],
  properties: [
    property({name: "contact", attributes: [attribute({name: "email", value: "bhoneydew@muppet.fuzz"})]})
  ]
}
createdDate = createdDate.add(1, "day");
const log1 = log({
  id: 1,
  title: "An interesting observation 1",
  source: "# Well this is interesting\n## Why\nBecause it seems cool\n## What\nSomething happened!\n1. a\n1. b\n1. c",
  description: "Well this is interesting\nWhy\nBecause it seems cool\nWhat\nSomething happened!\n1. a\n2. b\n3. c",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [logbook({name: "instruments"})],
  tags: [tag({name: "interesting"}), tag({name: "discovery"}), tag({name: "something"})],
  properties: [
    property({name: "contact", attributes: [attribute({name: "email", value: "bhoneydew@muppet.fuzz"})]}),
    replyGroup
  ]
})
createdDate = createdDate.add(5, "minutes");
const log2 = {
  ...log1,
  title: "An interesting observation 2",
  id: 2,
  source: "#meep!",
  description: "meep!",
  owner: "beaker",
  level: "Incident",
  tags: [tag({name: "boom"})],
  createdDate: createdDate.valueOf(),
  attachments: [attachment({filename: "results.jpeg"})]
}
createdDate = createdDate.add(1, "minutes");
const log3 = {
  ...log1,
  title: "An interesting observation 3",
  id: 3,
  source: "you okay?!",
  description: "you okay?!",
  owner: "bhoneydew",
  level: "Incident",
  tags: [tag({name: "boom"})],
  createdDate: createdDate.valueOf()
}
createdDate = createdDate.add(6, "minutes");
const log4 = {
  ...log1,
  title: "An interesting observation 3 (resolution)",
  id: 4,
  source: "meep! All is well now",
  description: "meep! All is well now",
  owner: "beaker",
  level: "Incident",
  tags: [tag({name: "resolution"})],
  createdDate: createdDate.valueOf()
}
createdDate = createdDate.add(1, "day");
const log5 = {
  id: 5,
  title: "The experiment is now a spectacular long-winded success!",
  source: "# Summary\nThe experiment succeeded\n## What Now\nTime to celebrate!\n1. Gather colleagues\n1. Celebrate\n1. Do more science",
  description: "Summary\nThe experiment succeeded\nWhat Now\nTime to celebrate!\n1. Gather colleagues\n1. Celebrate\n1. Do more science",
  owner: "bhoneydew",
  createdDate: createdDate.valueOf(),
  level: "Normal",
  logbooks: [logbook({name: "instruments"}), logbook({name: "party-commitee"})],
  tags: [tag({name: "success"}), tag({name: "discovery"})],
  properties: [
    property({name: "contact", attributes: [attribute({name: "email", value: "bhoneydew@muppet.fuzz"})]})
  ],
  attachments: [attachment({filename: "paper.pdf"})]
}

const SearchResultTreeListTemplate = (props) => {
  
  const onRowClick = (log) => {
    console.log({clicked: log});
  }

  return (
    <Paper sx={{
      width: "40%",
      minHeight: "90vh"
    }}>
      <SearchResultTreeList onRowClick={onRowClick} {...props} />
    </Paper>
  )

}
export const Default = (args) => <SearchResultTreeListTemplate {...args} />;
Default.args = {
  logs: [log0, log1, log2, log3, log4, log5],
  dateDescending: true
}
Default.parameters = {
  msw: {
    handlers: [
      rest.get('**/logs?properties=Log**', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.json([...replies])
        )
      }),
    ]
  },
}

const ReplyItemTemplate = (props) => {

  const onClick = (log) => {
    console.log({clicked: log});
  }

  return (
    <SearchResultGroupItem onClick={onClick} {...props} />
  )
}
const replies = [log1, log2, log3, log4] // BE replies are a flat group that includes the "parent"

export const ReplyItem = (args) => <ReplyItemTemplate {...args} />;
ReplyItem.args = {
  log: log2,
  dateDescending: true
}
ReplyItem.parameters = {...Default.parameters}

export const ReplyItemError = (args) => <ReplyItemTemplate {...args} />;
ReplyItemError.args = {...ReplyItem.args}
ReplyItemError.parameters = {
  msw: {
    handlers: [
      rest.get('**/logs?properties=Log**', (req, res, ctx) => {
        return res(
          ctx.delay(1000),
          ctx.status(400)
        )
      }),
    ]
  },
}
