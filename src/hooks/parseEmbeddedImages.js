import customization from "src/config/customization";

const mdImageRegex = new RegExp(
  "!\\[([^\\]]*)\\]\\(attachment/([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})\\)\\{width=(\\d+) height=(\\d+)\\}",
  "g"
);

export const parseEmbeddedImages = (commonmarkSrc, attachedFiles) => {
  let newContent = commonmarkSrc;

  // Replaces the remote image url with a local blob url for preview purposes
  const matches = [...commonmarkSrc.matchAll(mdImageRegex)];

  matches.forEach((match) => {
    const altText = match[1];
    const id = match[2];
    const width = match[3];
    const height = match[4];

    if (attachedFiles) {
      const file = attachedFiles.find((file) => file.id === id);
      newContent = newContent.replace(
        match[0],
        `![${altText}](${file.url}){width=${width} height=${height}}`
      );
    } else {
      newContent = newContent.replace(
        match[0],
        `![${altText}](${customization.APP_BASE_URL}/attachment/${id}){width=${width} height=${height}}`
      );
    }
  });
  return newContent;
};
