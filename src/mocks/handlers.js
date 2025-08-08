import { http, HttpResponse} from "msw";

export const defaultHandlers = [
  http.get("*/", () => {
    return HttpResponse.json({
      name: "Olog Service",
      version: "1.2.3-test",
      serverConfig: {
        maxFileSize: 51.0,
        maxRequestSize: 101.0
      }
    });
  }),
  http.get("*/logs/search", () => {
    return HttpResponse.json({
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
    });
  }),
  http.get("*/logs/*", () => {
    return HttpResponse.json({
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
    });
  }),
  http.get("*/tags", () => {
    return HttpResponse.json([
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
    ]);
  }),
  http.get("*/logbooks", () => {
    return HttpResponse.json([
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
    ]);
  }),
  http.get("*/properties", () => {
    return HttpResponse.json([
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
    ]);
  }),
  http.get("*/user", () => {
    return HttpResponse.json({ userName: "admin", roles: ["ROLE_ADMIN"] });
  }),
  http.put("*/logs", () => {
    return HttpResponse.json(null, { status: 200 });
  }),
  http.options("*/logs", () => {
    return HttpResponse.json(null, { status: 200 });
  })
];
