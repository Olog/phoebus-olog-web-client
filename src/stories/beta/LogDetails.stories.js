import { configureStore, createSlice } from "@reduxjs/toolkit";
import LogDetails from "beta/components/log/LogDetails/LogDetails";
import React from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";

export default {
    title: "beta/LogDetails",
    component: LogDetails
}

const log = {
    "id": 2146,
    "owner": "admin",
    "source": "# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6\n\nRegular *Italic* **Bold** ***Both***\n\n[Wikipedia Link Example](https://www.wikipedia.org/)\n\n![](attachment/some-attachment-2){width=710 height=302}\n\n![](attachment/some-attachment-1){width=1204 height=436}\n\nBlockQuotes:\n> *Lorem ipsum dolor sit amet consectetur adipisicing \nelit. Voluptas, quasi ut voluptates quo necessitatibus similique \nblanditiis illo, repellat enim error quidem qui quam, ab recusandae!*\n\nHorizontal Rule: \n\n---\n\nUnordered List:\n\n* Red\n    * Fruit\n        * Apples\n        * Peppers\n            * Sweet\n            * Spicy\n    * Objects\n        * Fire Hydrant \n* Green\n* Blue\n\nOrdered List:\n\n1. Intro\n    1. Hook\n    1. Summary\n1. Body\n    1. Supporting Point\n        1. More Details\n        1. More Details\n            1. Even More Details\n        1. More Details\n    1. Supporting Point\n    1. Supporting Point\n1. Conclusion\n    1. Summary\n    1. Closing\n\nThis is `inline code` whereas the below is: \n\n```\n// Block Code\nconst sayHello = (name) => {\n    console.log(`Hello, $\\{name\\}!`);\n};\nsayHello(\"World\");\n```\n\nTable:\n\n| Table Header 1| Table Header 2|\n|---------------|---------------|\n| Table Cell 11 | Table Cell 12 |\n| Table Cell 21 | Table Cell 22 |",
    "description": "Heading 1\nHeading 2\nHeading 3\nHeading 4\nHeading 5\nHeading 6\nRegular Italic Bold Both\n\"Wikipedia Link Example\" (https://www.wikipedia.org/)\nattachment/some-attachment-2{width=710 height=302}\nattachment/some-attachment-1{width=1204 height=436}\nBlockQuotes:\n«Lorem ipsum dolor sit amet consectetur adipisicing\nelit. Voluptas, quasi ut voluptates quo necessitatibus similique\nblanditiis illo, repellat enim error quidem qui quam, ab recusandae!»\nHorizontal Rule:\n***\nUnordered List:\n* Red\n   * Fruit\n      * Apples\n      * Peppers\n         * Sweet\n         * Spicy\n   * Objects\n      * Fire Hydrant\n* Green\n* Blue\nOrdered List:\n1. Intro\n   1. Hook\n   2. Summary\n2. Body\n   1. Supporting Point\n      1. More Details\n      2. More Details\n         1. Even More Details\n      3. More Details\n   2. Supporting Point\n   3. Supporting Point\n3. Conclusion\n   1. Summary\n   2. Closing\nThis is \"inline code\" whereas the below is:\n// Block Code\nconst sayHello = (name) => {\n    console.log(`Hello, $\\{name\\}!`);\n};\nsayHello(\"World\");\nTable:\n| Table Header 1| Table Header 2|\n|---------------|---------------|\n| Table Cell 11 | Table Cell 12 |\n| Table Cell 21 | Table Cell 22 |",
    "title": "test formatting",
    "level": "Info",
    "state": "Active",
    "createdDate": 1701078394986,
    "modifyDate": null,
    "events": null,
    "logbooks": [
        {
            "name": "e2e-tests",
            "owner": "cypress",
            "state": "Active"
        },
        {
            "name": "controls",
            "owner": null,
            "state": "Active"
        }
    ],
    "tags": [
        {
            "name": "e2e-test-tag",
            "state": "Active"
        }
    ],
    "properties": [
        {
            "name": "Shift Info",
            "owner": null,
            "state": "Active",
            "attributes": [
                {
                    "name": "Shift Lead Email",
                    "value": "shift.lead@ess.eu",
                    "state": "Active"
                },
                {
                    "name": "Shift Lead Phone",
                    "value": "+46123456789",
                    "state": "Active"
                },
                {
                    "name": "Operator",
                    "value": "Frodo Baggins",
                    "state": "Active"
                },
                {
                    "name": "Operator Phone",
                    "value": "+46987654321",
                    "state": "Active"
                },
                {
                    "name": "Shift Lead",
                    "value": "Aragorn II",
                    "state": "Active"
                },
                {
                    "name": "Shift ID",
                    "value": "20231128A",
                    "state": "Active"
                }
            ]
        },
        {
            "name": "resource",
            "owner": null,
            "state": "Active",
            "attributes": [
                {
                    "name": "name",
                    "value": "Some Resource Name",
                    "state": "Active"
                },
                {
                    "name": "file",
                    "value": "Some File",
                    "state": "Active"
                }
            ]
        },
        {
            "name": "Log Entry Group",
            "owner": null,
            "state": "Active",
            "attributes": [
                {
                    "name": "id",
                    "value": "7331e31e-3948-4f42-97ed-10475e5c34d9",
                    "state": "Active"
                }
            ]
        }
    ],
    "attachments": [
        {
            "id": "some-attachment-1",
            "filename": "Some Attachment 1",
            "fileMetadataDescription": "image",
            "checksum": null
        },
        {
            "id": "some-attachment-2",
            "filename": "Some Attachment 2",
            "fileMetadataDescription": "image",
            "checksum": null
        },
        ...[...Array(10).keys()].map(it => ({
            "id": `some-attachment-${it + 3}`,
            "filename": `Some ${it % 2 ? "Attachment": "File"} ${it + 3}`,
            "fileMetadataDescription": it % 2 ? "image" : "file",
            "checksum": null
        }))
    ]
}

const mockUserSlice = createSlice({
    name: "user",
    initialState: {
        user: { userName: "somebody" }
    }
})

const store = configureStore({
    reducer: {
        auth: mockUserSlice.reducer
    }
})

const Template = (args) => {

    return (
        <Provider store={store} >
            <MemoryRouter>
                <LogDetails {...args} />
            </MemoryRouter>
        </Provider>
    )
}

export const Default = (args) => <Template {...args} />;
Default.args = {
    log
}