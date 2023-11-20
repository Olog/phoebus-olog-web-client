import React from "react";
import userEvent from "@testing-library/user-event";
import { server } from "mocks/server";
import { rest } from "msw";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "test-utils/rtl-utils";
import { resultList } from "../../mocks/fixtures/generators";
import { testEntry } from "../../mocks/fixtures/generators";
import LogEntriesView from ".";

test("when user submits search many times, search is performed many times (no caching)", async () => {
  // When the user performs search many times, we see the loading banner every time
  const user = userEvent.setup();
  const { unmount } = render(
    <MemoryRouter>
      <LogEntriesView
        logbooks={[]}
        tags={[]}
      />
    </MemoryRouter>
  );

  // Given the page has performed the initial search request
  const initialResult = await screen.findByRole("heading", {
    name: /example title/i
  });
  expect(initialResult).toBeInTheDocument();

  // Given we expect search to be performed many times for the same query
  // But to return updated results each time
  const entry1 = testEntry({ title: "entry 1" });
  const entry2 = testEntry({ title: "entry 2" });
  const entry3 = testEntry({ title: "entry 3" });
  server.use(
    rest.get("*/logs/search", (req, res, ctx) => {
      return res.once(ctx.json(resultList([entry1, entry2, entry3])));
    })
  );
  server.use(
    rest.get("*/logs/search", (req, res, ctx) => {
      return res.once(ctx.json(resultList([entry1, entry2])));
    })
  );
  server.use(
    rest.get("*/logs/search", (req, res, ctx) => {
      return res.once(ctx.json(resultList([entry1])));
    })
  );

  // When the user submits their search, we find the first result set
  const searchBox = screen.getByRole("searchbox", { name: /Search/i });
  await user.click(searchBox);
  await user.keyboard("{Enter}");
  expect(
    await screen.findByRole("heading", { name: entry1.title })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: entry2.title })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: entry3.title })
  ).not.toBeInTheDocument();

  // When they submit again, we find the second result set
  await user.keyboard("{Enter}");
  expect(
    await screen.findByRole("heading", { name: entry1.title })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: entry2.title })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: entry3.title })
  ).not.toBeInTheDocument();

  // When they submit again, we find the third result set
  await user.keyboard("{Enter}");
  expect(
    await screen.findByRole("heading", { name: entry1.title })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: entry2.title })
  ).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: entry3.title })
  ).toBeInTheDocument();

  // cleanup network resources
  unmount();
});
