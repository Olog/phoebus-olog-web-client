import { v4 as uuidv4 } from "uuid";
import customization from "config/customization";

/*
    cyrb53 (c) 2018 bryc (github.com/bryc)
    A fast and simple hash function with decent collision resistance.
*/
const hash = function (str, seed = 0) {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export const logbook = ({ name, state = "Active", owner = null }) => ({
  name,
  owner,
  state
});

export const tag = ({ name, state = "Active", owner = null }) => ({
  name,
  owner,
  state
});

export const property = ({
  name,
  state = "Active",
  owner = null,
  attributes = []
}) => ({
  name,
  owner,
  state,
  attributes
});

export const attribute = ({ name, value = null, state = "Active" }) => ({
  name,
  state,
  value
});

export const group = ({
  id = uuidv4(),
  owner,
  propertyState = "Active",
  attributeState = "Active"
}) =>
  property({
    name: "Log Entry Group",
    owner,
    state: propertyState,
    attributes: [attribute({ name: "id", value: id, state: attributeState })]
  });

export const attachment = ({ id = uuidv4(), filename, isFile }) => ({
  id,
  filename,
  fileMetadataDescription: isFile ? "file" : "image",
  checksum: null
});

export const log = ({
  id,
  title,
  source,
  description,
  level = customization.defaultLevel,
  state = "Active",
  owner = null,
  createdDate = Date.now(),
  modifyDate = null,
  logbooks = [],
  tags = [],
  properties = [],
  attachments = []
}) => ({
  id: id || hash(title || 45),
  title,
  source,
  description,
  level,
  state,
  owner,
  createdDate,
  modifyDate,
  events: null,
  logbooks,
  tags,
  properties,
  attachments
});

// Utility test function that will setup the server to respond to the request
// with a log entry having the desired `title` is the `requestPredicate` is true
// otherwise will respond with empty search results
export const testEntry = ({ id, title, createdDate }) =>
  log({
    id,
    owner: "jones",
    source: `${title} source`,
    description: `${title} description`,
    title,
    createdDate: createdDate || 1656599929021,
    level: "Normal"
  });

export const resultList = (testEntries = [], hitCount) => {
  return {
    hitCount: hitCount || testEntries.length,
    logs: [...testEntries]
  };
};
