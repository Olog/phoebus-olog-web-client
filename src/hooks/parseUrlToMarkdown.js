const urlFormatRegex = /^(https|http):\/\/([^/]+)\/logs\/(\d+)$/;

const replaceAt = (text, replacement, start, end) =>
  text.substring(0, start) + replacement + text.substring(end);

export const parseUrlToMarkdown = (input, descriptionRef) => {
  const matches = input.match(urlFormatRegex);
  const textarea = descriptionRef.current;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = textarea.value.substring(start, end);

  if (matches) {
    const replacementText = `[${selectedText || matches[3]}](${matches[0]})`;
    return {
      parsedContent: replaceAt(textarea.value, replacementText, start, end),
      cursorPosition: start + replacementText.length
    };
  } else {
    return {
      parsedContent: replaceAt(textarea.value, input, start, end),
      cursorPosition: start + input.length
    };
  }
};
