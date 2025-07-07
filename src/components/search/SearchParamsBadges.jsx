import { Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { EntryTypeChip } from "../log/EntryTypeChip";
import { LogbookChip } from "../log/LogbookChip";
import { TagChip } from "../log/TagChip";
import { TextChip } from "../log/TextChip";
import {
  defaultSearchParams,
  useSearchParams
} from "features/searchParamsReducer";
import { updateAdvancedSearch } from "src/features/advancedSearchThunk";

const ChipList = ({ items, onChange, Component }) => {
  const onDelete = (itemToDelete) => {
    const updated = items.filter((it) => it !== itemToDelete);
    onChange(updated);
  };
  return (
    <>
      {items.map((item) => (
        <Component
          key={item}
          name={item}
          value={item}
          onDelete={() => onDelete(item)}
        />
      ))}
    </>
  );
};

export const SearchParamsBadges = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const onSearch = (vals) => dispatch(updateAdvancedSearch(vals));

  const {
    title,
    level,
    desc,
    properties,
    owner,
    attachments,
    start,
    end,
    tags,
    logbooks
  } = searchParams;

  return (
    <Stack
      flexDirection="row"
      gap={0.5}
      flexWrap="wrap"
      padding={0.5}
    >
      {title ? (
        <TextChip
          name="title"
          value={title}
          onDelete={() =>
            onSearch({ ...searchParams, title: defaultSearchParams.title })
          }
        />
      ) : null}
      {level ? (
        <ChipList
          items={level}
          onChange={(val) => onSearch({ ...searchParams, level: val })}
          Component={EntryTypeChip}
        />
      ) : null}
      {desc ? (
        <TextChip
          name="description"
          value={desc}
          onDelete={() =>
            onSearch({
              ...searchParams,
              desc: defaultSearchParams.desc
            })
          }
        />
      ) : null}
      {properties ? (
        <TextChip
          name="properties"
          value={properties}
          onDelete={() =>
            onSearch({
              ...searchParams,
              properties: defaultSearchParams.properties
            })
          }
        />
      ) : null}
      {owner ? (
        <TextChip
          name="author"
          value={owner}
          onDelete={() =>
            onSearch({ ...searchParams, owner: defaultSearchParams.owner })
          }
        />
      ) : null}
      {attachments ? (
        <TextChip
          name="attach"
          value={attachments}
          onDelete={() =>
            onSearch({
              ...searchParams,
              attachments: defaultSearchParams.attachments
            })
          }
        />
      ) : null}
      {start ? (
        <TextChip
          name="from"
          value={start}
          onDelete={() =>
            onSearch({ ...searchParams, start: defaultSearchParams.start })
          }
        />
      ) : null}
      {end ? (
        <TextChip
          name="to"
          value={end}
          onDelete={() =>
            onSearch({ ...searchParams, end: defaultSearchParams.end })
          }
        />
      ) : null}
      {tags ? (
        <ChipList
          items={tags}
          onChange={(val) => onSearch({ ...searchParams, tags: val })}
          Component={TagChip}
        />
      ) : null}
      {logbooks ? (
        <ChipList
          items={logbooks}
          onChange={(val) => onSearch({ ...searchParams, logbooks: val })}
          Component={LogbookChip}
        />
      ) : null}
    </Stack>
  );
};
