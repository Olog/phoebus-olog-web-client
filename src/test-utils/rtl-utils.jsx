/**
 * Copyright (C) 2019 European Spallation Source ERIC.
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

import { http, HttpResponse, delay } from "msw";
import { render, within } from "@testing-library/react";
import { AppWrapper } from "./wrappers";
import { setupStore } from "../features/store";
import { resultList, testEntry } from "../mocks/fixtures/generators";
import { server } from "mocks/server";

const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => {
    return <AppWrapper store={store}>{children}</AppWrapper>;
  };
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

export * from "@testing-library/react";

export { renderWithProviders as render };

export const givenServerRespondsWithSearchRequest = ({
  title,
  requestPredicate
}) => {
  server.use(
    http.get("*/logs/search", async (req) => {
      if (requestPredicate(req)) {
        // Add delay
        await delay();
        return HttpResponse.json(resultList([testEntry({ title })]));
      } else {
        return HttpResponse.json(resultList([]));
      }
    })
  );
};

/**
 * Tests the selection state of react-select elements.
 * TODO: Consider a different select element that is more testable...It works, but it's fragile because it uses divs and custom aria roles
 * instead of semantic html (such as selection and options).
 * So, in order to test we are reduced to checking for presence of text within the page (rather than checking if e.g. an option is selected).
 */
export const expectSelected = async ({
  screen,
  label,
  selected,
  notSelected
}) => {
  const selectionInput = await screen.findByRole("combobox", {
    name: new RegExp(label, "i")
  });
  if (Array.isArray(selected)) {
    const selectionParentContainer = selectionInput.closest(
      "div.MuiFormControl-root"
    );
    for (let selectedItem of selected) {
      expect(
        within(selectionParentContainer).getByRole("button", {
          name: new RegExp(selectedItem, "i")
        })
      ).toBeInTheDocument();
    }
    for (let notSelectedItem of notSelected) {
      expect(
        within(selectionParentContainer).queryByRole("button", {
          name: new RegExp(notSelectedItem, "i")
        })
      ).not.toBeInTheDocument();
    }
  } else {
    expect(selectionInput).toHaveValue(selected);
  }
};

export const selectFromCombobox = async ({
  screen,
  user,
  label,
  values = []
}) => {
  const comboboxInput = await screen.findByRole("combobox", {
    name: new RegExp(label, "i")
  });
  await user.click(comboboxInput);
  for (let value of values) {
    const option = await screen.findByRole("option", {
      name: new RegExp(value, "i")
    });
    await user.click(option);
  }
};
