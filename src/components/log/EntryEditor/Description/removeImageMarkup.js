/**
 * Removes image markup from a (body/decription) text, if present. Typical
 * use cas is when user removes an attachement that was added as an
 * embedded image in the body/description.
 * @param {*} markup
 * @param {*} imageId
 * @returns
 */
export default function removeImageMarkup(markup, imageId) {
  let index = markup.indexOf(imageId);
  if (index === -1) {
    return markup;
  }

  let stringBefore = markup.substring(0, index);
  let stringAfter = markup.substring(index + imageId.length, markup.length);

  let exclamationMarkIndex = stringBefore.lastIndexOf("!");
  let closingCurlyBraceIndex = stringAfter.indexOf("}");

  return (
    markup.substring(0, exclamationMarkIndex) +
    markup.substring(
      (stringBefore + imageId).length + closingCurlyBraceIndex + 1,
      markup.length
    )
  );
}
