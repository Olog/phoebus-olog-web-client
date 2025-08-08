import axios from "axios";

const TEST_BE_URL = import.meta.env.TEST_BE_URL;

const entry = {
  owner: "log",
  description: "Test Description",
  level: "Info",
  title: "Test Entry",
  logbooks: [
    {
      name: "e2e-tests",
    },
  ],
  tags: [
    {
      name: "e2e-test-tag",
    },
  ],
};

const createEntry = (entry) => {
  return axios.request({
    method: "put",
    url: `${TEST_BE_URL}/logs`,
    withCredentials: true,
    auth: {
      username: "admin",
      password: "adminPass",
    },
    data: entry,
  });
};

const createLogbook = (name) => {
  return axios.request({
    method: "put",
    url: `${TEST_BE_URL}/logbooks/${name}`,
    withCredentials: true,
    auth: {
      username: "admin",
      password: "adminPass",
    },
    data: {
      owner: "cypress",
      name,
      state: "Active",
    },
  });
};
const createTag = (name) => {
  return axios.request({
    method: "put",
    url: `${TEST_BE_URL}/tags/${name}`,
    withCredentials: true,
    auth: {
      username: "admin",
      password: "adminPass",
    },
    data: {
      name,
      state: "Active",
    },
  });
};
const createProperty = (property) => {
  return axios.request({
    method: "put",
    url: `${TEST_BE_URL}/properties/${property.name}`,
    withCredentials: true,
    auth: {
      username: "admin",
      password: "adminPass",
    },
    data: property,
  });
};

const seedDatabase = async () => {
  console.log(">>> seeding database");
  console.log({ testBackendUrl: TEST_BE_URL });
  await createTag("e2e-test-tag");
  await createLogbook("e2e-tests");
  await createProperty({
    name: "resource",
    owner: null,
    state: "Active",
    attributes: [
      {
        name: "file",
        value: null,
        state: "Active",
      },
      {
        name: "name",
        value: null,
        state: "Active",
      },
    ],
  });
  for (let i = 0; i < 35; i++) {
    await createEntry({ ...entry, title: `Entry #${i + 1}` });
  }
  console.log(">>> ...done!");
  return null;
};

export { seedDatabase };
