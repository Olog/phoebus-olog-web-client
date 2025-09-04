import { Stack } from "@mui/material";
import { EntryTypeChip } from "../log/EntryTypeChip";
import { LogbookChip } from "../log/LogbookChip";
import { TagChip } from "../log/TagChip";
import { TextChip } from "../log/TextChip";
import { useEnhancedSearchParams } from "src/hooks/useEnhancedSearchParams";

const ChipList = ({ items, onDelete, Component }) => {
  return (
    <>
      {items.map((item) => (
        <Component
          key={item}
          name={item}
          value={item}
          onDelete={() => onDelete(items.filter((it) => it !== item))}
        />
      ))}
    </>
  );
};

export const SearchParamsBadges = () => {
  const { searchParams, setSearchParams } = useEnhancedSearchParams();

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

  const handleDelete = (name) => {
    let nameCopy = name;

    if (nameCopy === "author") {
      nameCopy = "owner";
    }
    setSearchParams({
      ...searchParams,
      [nameCopy]: ""
    });
  };

  const handleDeleteList = (key, items) => {
    setSearchParams({
      ...searchParams,
      [key]: items
    });
  };

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
          onDelete={handleDelete}
        />
      ) : null}
      {desc ? (
        <TextChip
          name="desc"
          value={desc}
          onDelete={handleDelete}
        />
      ) : null}
      {properties ? (
        <TextChip
          name="properties"
          value={properties}
          onDelete={handleDelete}
        />
      ) : null}
      {owner ? (
        <TextChip
          name="author"
          value={owner}
          onDelete={handleDelete}
        />
      ) : null}
      {attachments ? (
        <TextChip
          name="attachments"
          value={attachments}
          onDelete={handleDelete}
        />
      ) : null}
      {start ? (
        <TextChip
          name="start"
          value={start}
          onDelete={handleDelete}
        />
      ) : null}
      {end ? (
        <TextChip
          name="end"
          value={end}
          onDelete={handleDelete}
        />
      ) : null}
      {level ? (
        <ChipList
          items={level}
          onDelete={(items) => handleDeleteList("level", items)}
          Component={EntryTypeChip}
        />
      ) : null}
      {tags ? (
        <ChipList
          items={tags}
          onDelete={(items) => handleDeleteList("tags", items)}
          Component={TagChip}
        />
      ) : null}
      {logbooks ? (
        <ChipList
          items={logbooks}
          onDelete={(items) => handleDeleteList("logbooks", items)}
          Component={LogbookChip}
        />
      ) : null}
    </Stack>
  );
};
