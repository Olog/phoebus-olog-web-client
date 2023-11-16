/**
 * Copyright (C) 2020 European Spallation Source ERIC.
 * <p>
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 * <p>
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * <p>
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */

/**
 * The prupose of this Remarkable plugin is to support sizing of images
 * which are locally uploaded image objects,
 * as defined by the commonmark-java image attributes extension,
 * see https://github.com/commonmark/commonmark-java#image-attributes.
 * 
 * Both absolute and relative image URLs are supported.
 */ 
/**
 * This is a string prepended to the src attribute when creating the img tag.
 * It can be used to account for a deployment scenario where the 
 * path to the image resource is relative in the markup, but must be changed
 * to an absolute path. Client code should add this plugin like so:
 * 
 * remarkable.use(imageProcessor, {urlPrefix: 'http://foo.com/bar'});
 */
var urlPrefix = '';

/**
 * This is a array of file objects and their index currently added as
 * attachment or embedded image. This is used by HTML preview feature
 * to map image id to its file object.
 * Client code should add this plugin like so:
 *
 * remarkable.use(imageProcessor, {attachedFiles: <attached files array> });
 */
var allAttachedFiles = [];

/**
 * Returns a Attachment object based on given id.
 */
export function getFileObject(id, attachedFiles){
    for (var i = 0; i < attachedFiles.length; i++){
        if (attachedFiles[i].id === id) {
            return attachedFiles[i];
        }
    }
        return null;
}
/**
 * Matches a string against the commonmark image markup specification, i.e.
 * ![alt-text](image url)
 * Returns null if the input string is null or does not match, otherwise a non-null
 * object (string array).
 * @param {*} rawImageMarkup 
 */
export function matchImage(rawImageMarkup){
    if(!rawImageMarkup){
        return null;
    }
    return rawImageMarkup.match(/!\[.*\]\(.*\)/);
}

/**
 * Matches a non-null string against a image size specification as defined by the commonmark-java
 * image attributes extension, see https://github.com/commonmark/commonmark-java#image-attributes.
 * An input string like "{width=100 height=100} some extra text" will match and the function will
 * return an array as follows:
 * [0] {width=100 height=100} some extra text
 * [1] {width=100 height=100}
 * [2] width=100 height=100
 * [3] some extra text
 * A non-matching string like "some extra text" will return an array as follows:
 * [0] some extra text
 * [1] undefined
 * [2] undefined
 * [3] some extra text
 * 
 * @param {*} text 
 */
export function matchSizeDefinition(text){
    if(!text){
        return null;
    }
    var split = text.match(/(\{(width=[0-9]{1,9}\s+height=[0-9]{1,9})\})?(.*)/i);
    if(!split){
        split = text.match(/(\{(height=[0-9]{1,9}\s+width=[0-9]{1,9})\})?(.*)/i);
    }
    return split;
}

/**
 * Processes an image node and optionally for HTML preview - if the text node contains a size
 * specification - adds image size to the html. If the text node contains additional
 * content, it is returned as a seperate text node in the output array.
 * @param {*} imageNode The image markup node, e.g. ![alt-text](http://foo.bar/image.jpg)
 * @param {*} textNode Contains an image specification, e.g. {width=100 height=100}, but may
 * also contain additional text.
 */
export function processImageHtmlPreview(imageNode, textNode, attachedFiles){
    // Find the image attachment object index
    var imgId = imageNode.src.split("attachment/");
    var imgTag = null;
    if (imgId.length > 1) {
        imgId = imgId[1];
        // Find the image file object using the image Attachment index
        var fileObj = getFileObject(imgId, attachedFiles);
        var imgSrc = null;
        if (fileObj) {
            imgSrc = URL.createObjectURL(fileObj.file);
        }else{
            imgSrc = imageNode.src;
        }
        imgTag = '<img src="' + imgSrc + '" alt="' + imageNode.alt + '"';
    }
    else{
        imgTag = '<img src="' + imageNode.src + '" alt="' + imageNode.alt + '"';
    }
    var split = matchSizeDefinition(textNode);
    if(split && split[2]){
        let size = split[2].toLowerCase();
        imgTag += ' ' + size;
    }
    imgTag += '>';
    var img = {type: 'htmltag', content: imgTag};
    var leftOver = {type: 'text', content: split ? split[3] : ""};
    return [img, leftOver];
}

/**
 * Processes an image node and optionally - if the text node contains a size
 * specification - adds image size to the html. If the text node contains additional
 * content, it is returned as a seperate text node in the output array.
 * @param {*} imageNode The image markup node, e.g. ![alt-text](http://foo.bar/image.jpg)
 * @param {*} textNode Contains an image specification, e.g. {width=100 height=100}, but may
 * also contain additional text.
 */
export function processImage(imageNode, textNode){
    var imgTag = '<img src="' + urlPrefix + imageNode.src + '" alt="' + imageNode.alt + '"';
    var split = matchSizeDefinition(textNode);
    if(split && split[2]){
        let size = split[2].toLowerCase();
        imgTag += ' ' + size;
    }
    imgTag += '>';
    var img = {type: 'htmltag', content: imgTag};
    var leftOver = {type: 'text', content: split ? split[3] : ""};
    return [img, leftOver];
}

/**
 * Processes image tokens for Log details view or HTML preview based on config fields.
 * If config.setHtmlPreview is true, it processes image tokens for HTML preview else for 
 * log details view.
 */

const imageProcessor = (md, config) => {
    var setHtmlPreview = false;
    if(config){
        if(config.urlPrefix){
            urlPrefix = config.urlPrefix;
        }
        if(config.attachedFiles){
            allAttachedFiles = config.attachedFiles;
        }
        if(config.setHtmlPreview){
            setHtmlPreview = config.setHtmlPreview;
        }
    }
    md.core.ruler.push('sizeprocessor', function(state) {
        // state.tokens is an array of all tokens in the commonmark content.
        for (var i = 0; i < state.tokens.length; i++) {
            // Process one token at a time...
            var token = state.tokens[i];
            // ...only tokens of type inline are of interest for processing, 
            // and only if the token contains at least one image markup.
            var match = matchImage(token.content);
            let tmp = [];
            if (token.type === 'inline' && match) {
                // Loop through the token.children array. 
                // Image entries are processed using subsequent entry if it is a text entry
                // and if it contains a size definition.
                var skip = false; // Keep track of whether to skip next element when iterating.
                for (const [i, value] of token.children.entries()) {
                    if(skip){
                        skip = false;
                        continue;
                    }
                    if(value.type === 'image'){
                        if(i + 1 < token.children.length && token.children[i + 1].type === 'text'){
                            var v = '';
                            if(setHtmlPreview){
                                v = processImageHtmlPreview(value, token.children[i + 1].content, allAttachedFiles);
                            }
                            else{
                                v = processImage(value, token.children[i + 1].content);
                            }
                            tmp = tmp.concat(v);
                            skip = true; // Next element must be skipped in loop.
                        }
                        else{
                            tmp = tmp.concat(processImage(value, null));
                        }
                    }
                    else{
                        tmp = tmp.concat(value);
                    }
                }
                token.children = tmp;
            }
        }
        allAttachedFiles = [];
    });
 };

 export default imageProcessor;
