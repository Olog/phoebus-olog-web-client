import React from "react";
import { Stack } from "@mui/material";
import { EntryTypeChip } from "../log/EntryTypeChip";
import { LogbookChip } from "../log/LogbookChip";
import { TagChip } from "../log/TagChip";
import { TextChip } from "../log/TextChip";
import { defaultSearchParams } from "features/searchParamsReducer";

const LogbooksList = ({logbooks, onChange}) => {

  const onDelete = (logbook) => {
    const updated = logbooks.filter(it => it.name !== logbook.name);
    onChange(updated);
  }

  return (
    <>
      {logbooks.map(logbook => <LogbookChip key={logbook?.name} value={logbook?.name} onDelete={() => onDelete(logbook)} />)}
    </>
  )
}

const TagsList = ({tags, onChange}) => {

  const onDelete = (tag) => {
    const updated = tags.filter(it => it.name !== tag.name);
    onChange(updated);
  }

  return (
    <>
      {tags.map(tag => <TagChip key={tag?.name} value={tag?.name} onDelete={() => onDelete(tag)} />)}
    </>
  )
}

export const SearchParamsBadges = ({search, onSearch}) => {

  const { title, level, desc, owner, attachments, start, end, tags, logbooks } = search;

  return (
    <Stack flexDirection="row" gap={0.5} flexWrap="wrap" padding={0.5}>
      {title ? <TextChip name="title" value={title} onDelete={() => onSearch({...search, title: defaultSearchParams.title})} /> : null}
      {level ? <EntryTypeChip value={level} onDelete={() => onSearch({...search, level: defaultSearchParams.level})} /> : null}
      {desc ? <TextChip name="desc" value={desc} onDelete={() => onSearch({...search, desc: defaultSearchParams.desc})} /> : null}
      {owner ? <TextChip name="author" value={owner} onDelete={() => onSearch({...search, owner: defaultSearchParams.owner})} /> : null}
      {attachments ? <TextChip name="attach" value={attachments} onDelete={() => onSearch({...search, attachments: defaultSearchParams.attachments})} /> : null}
      {start ? <TextChip name="from" value={start} onDelete={() => onSearch({...search, start: defaultSearchParams.start})} /> : null}
      {end ? <TextChip name="to" value={end} onDelete={() => onSearch({...search, end: defaultSearchParams.end})} /> : null}
      {tags ? <TagsList tags={tags} onChange={(val) => onSearch({...search, tags: val})} /> : null}
      {logbooks ? <LogbooksList logbooks={logbooks} onChange={(val) => onSearch({...search, logbooks: val})} /> : null}
    </Stack>
  );

};