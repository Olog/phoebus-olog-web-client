import { rest } from "msw";

export const defaultHandlers = [
  rest.get("/", (req, res, ctx) => {
    return res(
      ctx.json({
        name: "Olog Service",
        version: "1.2.3-test",
        serverConfig: {
          maxFileSize: 50.0,
          maxRequestSize: 100.0
        }
      })
    );
  }),
  rest.get("*/logs/search", (req, res, ctx) => {
    return res(
      ctx.json({
        hitCount: 1,
        logs: [
          {
            id: 37,
            owner: "admin",
            source: "example entry",
            description: "example entry",
            title: "example title",
            level: "Normal",
            state: "Active",
            createdDate: 1656599929021,
            modifyDate: null,
            events: null,
            logbooks: [
              {
                name: "controls",
                owner: null,
                state: "Active"
              }
            ],
            tags: [
              {
                name: "bar",
                state: "Active"
              },
              {
                name: "baz",
                state: "Active"
              }
            ],
            properties: [],
            attachments: []
          }
        ]
      })
    );
  }),
  rest.get("*/logs/*", (req, res, ctx) => {
    return res(
      ctx.json({
        id: 37,
        owner: "admin",
        source: "example entry",
        description: "example entry",
        title: "example title",
        level: "Normal",
        state: "Active",
        createdDate: 1656599929021,
        modifyDate: null,
        events: null,
        logbooks: [
          {
            name: "controls",
            owner: null,
            state: "Active"
          }
        ],
        tags: [
          {
            name: "bar",
            state: "Active"
          },
          {
            name: "baz",
            state: "Active"
          }
        ],
        properties: [],
        attachments: []
      })
    );
  }),
  rest.get("*/tags", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "bar",
          state: "Active"
        },
        {
          name: "baz",
          state: "Active"
        },
        {
          name: "foo",
          state: "Active"
        }
      ])
    );
  }),
  rest.get("*/logbooks", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "test controls",
          owner: null,
          state: "Active"
        },
        {
          name: "test operations",
          owner: "olog-logs",
          state: "Active"
        }
      ])
    );
  }),
  rest.get("*/properties", (req, res, ctx) => {
    return res(
      ctx.json([
        {
          name: "Ticket",
          owner: "olog-logs",
          state: "Active",
          attributes: [
            {
              name: "url",
              value: null,
              state: "Active"
            },
            {
              name: "id",
              value: null,
              state: "Active"
            }
          ]
        },
        {
          name: "longname",
          owner: null,
          state: "Active",
          attributes: [
            {
              name: "thisAttributeNameIsReallyReallyLongOhByTheWayDidITellYouAboutUhmAhUhmn",
              value: null,
              state: "Active"
            },
            {
              name: "imShort",
              value: null,
              state: "Active"
            },
            {
              name: "howdyImAmiddleSizedAttribute",
              value: null,
              state: "Active"
            }
          ]
        },
        {
          name: "resource",
          owner: null,
          state: "Active",
          attributes: [
            {
              name: "file",
              value: null,
              state: "Active"
            },
            {
              name: "name",
              value: null,
              state: "Active"
            }
          ]
        }
      ])
    );
  }),
  rest.get("*/user", (req, res, ctx) => {
    return res(ctx.json({ userName: "admin", roles: ["ROLE_ADMIN"] }));
  }),
  rest.put("*/logs", (req, res, ctx) => {
    return res(ctx.status(200));
  }),
  rest.options("*/logs", (req, res, ctx) => {
    return res(ctx.status(200));
  })
];
