import React from "react";
import { Stack } from "@mui/material";
import { EntryTypeChip } from "../log/EntryTypeChip";
import { LogbookChip } from "../log/LogbookChip";
import { TagChip } from "../log/TagChip";
import { TextChip } from "../log/TextChip";
import {
  defaultSearchParams,
  updateSearchParams,
  useSearchParams,
} from "features/searchParamsReducer";
import { useDispatch } from "react-redux";

const LogbooksList = ({ logbooks, onChange }) => {
  const onDelete = (logbook) => {
    const updated = logbooks.filter((it) => it.name !== logbook.name);
    onChange(updated);
  };

  return (
    <>
      {logbooks.map((logbook) => (
        <LogbookChip
          key={logbook?.name}
          value={logbook?.name}
          onDelete={() => onDelete(logbook)}
        />
      ))}
    </>
  );
};

const TagsList = ({ tags, onChange }) => {
  const onDelete = (tag) => {
    const updated = tags.filter((it) => it.name !== tag.name);
    onChange(updated);
  };

  return (
    <>
      {tags.map((tag) => (
        <TagChip
          key={tag?.name}
          value={tag?.name}
          onDelete={() => onDelete(tag)}
        />
      ))}
    </>
  );
};

export const SearchParamsBadges = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const onSearch = (vals) => dispatch(updateSearchParams(vals));

  const { title, level, desc, owner, attachments, start, end, tags, logbooks } =
    searchParams;

  return (
    <Stack flexDirection="row" gap={0.5} flexWrap="wrap" padding={0.5}>
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
        <EntryTypeChip
          value={level}
          onDelete={() =>
            onSearch({ ...searchParams, level: defaultSearchParams.level })
          }
        />
      ) : null}
      {desc ? (
        <TextChip
          name="desc"
          value={desc}
          onDelete={() =>
            onSearch({ ...searchParams, desc: defaultSearchParams.desc })
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
              attachments: defaultSearchParams.attachments,
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
        <TagsList
          tags={tags}
          onChange={(val) => onSearch({ ...searchParams, tags: val })}
        />
      ) : null}
      {logbooks ? (
        <LogbooksList
          logbooks={logbooks}
          onChange={(val) => onSearch({ ...searchParams, logbooks: val })}
        />
      ) : null}
    </Stack>
  );
};
