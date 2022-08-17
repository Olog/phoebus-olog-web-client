import { rest } from 'msw';

export const defaultHandlers = [
    rest.get('*/logs/search', (req, res, ctx) => {
        return res(
            ctx.json({
                hitCount: 1,
                logs: [
                    {
                        "id": 37,
                        "owner": "admin",
                        "source": "example entry",
                        "description": "example entry",
                        "title": "example title",
                        "level": "Normal",
                        "state": "Active",
                        "createdDate": 1656599929021,
                        "modifyDate": null,
                        "events": null,
                        "logbooks": [
                            {
                                "name": "controls",
                                "owner": null,
                                "state": "Active"
                            }
                        ],
                        "tags": [
                            {
                                "name": "bar",
                                "state": "Active"
                            },
                            {
                                "name": "baz",
                                "state": "Active"
                            }
                        ],
                        "properties": [],
                        "attachments": []
                    }
                ]
            })
        );
    }),
    rest.get('*/tags', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    "name": "bar",
                    "state": "Active"
                },
                {
                    "name": "baz",
                    "state": "Active"
                },
                {
                    "name": "foo",
                    "state": "Active"
                }
            ])
        )
    }),
    rest.get('*/logbooks', (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    "name": "controls",
                    "owner": null,
                    "state": "Active"
                },
                {
                    "name": "operations",
                    "owner": "olog-logs",
                    "state": "Active"
                }
            ])
        )
    })
];