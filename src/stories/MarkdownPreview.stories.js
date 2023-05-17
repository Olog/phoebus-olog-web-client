import React from "react";
// import { MarkdownPreview } from "components/shared/Markdown";
import HtmlPreview from "components/EntryEditor/HtmlPreview";

export default {
    title: "Common/Markdown",
    component: HtmlPreview
}

const source = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

Regular *Italic* **Bold** ***Both***

[Wikipedia Link Example](https://www.wikipedia.org/)

Regular Image:

![React Logo](./logo192.png)

Resized Image:

![Stretched React Logo](./logo192.png){width=200 height=50}

BlockQuotes:
> *Lorem ipsum dolor sit amet consectetur adipisicing 
elit. Voluptas, quasi ut voluptates quo necessitatibus similique 
blanditiis illo, repellat enim error quidem qui quam, ab recusandae!*

Horizontal Rule: 

---

Unordered List:

* Red
    * Fruit
        * Apples
        * Peppers
            * Sweet
            * Spicy
    * Objects
        * Fire Hydrant 
* Green
* Blue

Ordered List:

1. Intro
    1. Hook
    1. Summary
1. Body
    1. Supporting Point
        1. More Details
        1. More Details
            1. Even More Details
        1. More Details
    1. Supporting Point
    1. Supporting Point
1. Conclusion
    1. Summary
    1. Closing

This is \`inline code\` whereas the below is: 

\`\`\`
// Block Code
const sayHello = (name) => {
    console.log(\`Hello, $\{name\}!\`);
};
sayHello("World");
\`\`\`

Table:

| Table Header 1| Table Header 2|
|---------------|---------------|
| Table Cell 11 | Table Cell 12 |
| Table Cell 21 | Table Cell 22 |
`; 

export const Default = {
    args: {
        showHtmlPreview: true,
        setShowHtmlPreview: () => {},
        getCommonmarkSrc: () => source, 
        getAttachedFiles: () => []
    }
};
