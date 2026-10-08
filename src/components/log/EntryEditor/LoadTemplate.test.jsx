import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor
} from "@testing-library/react";
import { useForm } from "react-hook-form";
import LoadTemplate from "./LoadTemplate";
import MuiThemeProvider from "providers/MuiThemeProvider";
import TextInput from "components/shared/input/TextInput";
import EntryTypeSelect from "components/shared/input/managed/EntryTypeSelect";
import LogbooksMultiSelect from "components/shared/input/managed/LogbooksMultiSelect";
import TagsMultiSelect from "components/shared/input/managed/TagsMultiSelect";
import { PropertyCollectionInput } from "components/shared/input/managed/PropertyCollectionInput";
import { ologApi } from "api/ologApi";

vi.mock("api/ologApi", () => ({
  ologApi: {
    endpoints: {
      getTemplates: { useQuery: vi.fn() },
      getProperties: { useQuery: () => ({ data: [] }) }
    }
  }
}));

afterEach(cleanup);

const levels = [{ name: "Info" }, { name: "Warning" }];
const initialValues = {
  title: "Draft title",
  description: "Draft description",
  level: levels[0],
  logbooks: [],
  tags: [],
  properties: [
    { name: "Old property", attributes: [{ name: "Old value", value: "old" }] }
  ],
  attachments: [{ id: "existing-attachment" }]
};

const EditorFields = ({ onSubmit }) => {
  const form = useForm({ defaultValues: initialValues });
  const selectProps = {
    control: form.control,
    getOptionLabel: (option) => option.name,
    isOptionEqualToValue: (option, value) => option.name === value.name
  };
  return (
    <MuiThemeProvider>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <TextInput
          name="title"
          label="Title"
          control={form.control}
        />
        <TextInput
          name="description"
          label="Description"
          control={form.control}
        />
        <EntryTypeSelect
          {...selectProps}
          options={levels}
        />
        <LogbooksMultiSelect
          {...selectProps}
          options={[{ name: "Operations" }]}
        />
        <TagsMultiSelect
          {...selectProps}
          options={[{ name: "Shift" }]}
        />
        <PropertyCollectionInput control={form.control}>
          <LoadTemplate
            form={form}
            levels={levels}
          />
        </PropertyCollectionInput>
        <button type="submit">Submit</button>
      </form>
    </MuiThemeProvider>
  );
};

const selectTemplate = async (template) => {
  ologApi.endpoints.getTemplates.useQuery.mockReturnValue({ data: [template] });
  const onSubmit = vi.fn();
  render(<EditorFields onSubmit={onSubmit} />);
  fireEvent.click(screen.getByRole("button", { name: "Load template" }));
  fireEvent.click(
    screen.getByRole("button", { name: `Load ${template.name}` })
  );
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  return onSubmit;
};

describe("loading a template", () => {
  it("updates visible entry components and submitted values", async () => {
    const template = {
      id: "shift",
      name: "Shift report",
      title: "Morning shift",
      source: "## Shift notes",
      level: "Warning",
      logbooks: [{ name: "Operations" }],
      tags: [{ name: "Shift" }],
      properties: [
        {
          name: "Shift details",
          attributes: [{ name: "Operator", value: "Alice" }]
        }
      ]
    };
    const onSubmit = await selectTemplate(template);
    expect(screen.getByRole("textbox", { name: "Title" }).value).toBe(
      template.title
    );
    expect(screen.getByRole("textbox", { name: "Description" }).value).toBe(
      template.source
    );
    expect(screen.getByRole("combobox", { name: "Entry Type" }).value).toBe(
      "Warning"
    );
    expect(screen.getByText("Operations")).toBeTruthy();
    expect(screen.getByText("Shift")).toBeTruthy();
    expect(screen.getByRole("textbox", { name: "Operator" }).value).toBe(
      "Alice"
    );
    expect(screen.queryByText("Old property")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      title: template.title,
      description: template.source,
      level: levels[1],
      logbooks: template.logbooks,
      tags: template.tags,
      properties: template.properties,
      attachments: initialValues.attachments
    });
  });

  it("preserves omitted fields and applies explicitly empty values", async () => {
    const onSubmit = await selectTemplate({
      id: "partial",
      name: "Partial template",
      description: "",
      properties: []
    });
    expect(screen.getByRole("textbox", { name: "Title" }).value).toBe(
      initialValues.title
    );
    expect(screen.getByRole("textbox", { name: "Description" }).value).toBe("");
    expect(screen.queryByText("Old property")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0][0]).toEqual({
      ...initialValues,
      description: "",
      properties: []
    });
  });
});
