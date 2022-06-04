import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import useAirtable from "../hooks/useAirtable";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

interface OwnProps {
  onValueChange(value: any): void;
}

export default function TaskListDropdown({ onValueChange }: OwnProps) {
  const {
    data: taskLists,
    error: taskListsError,
    loading: taskListsLoading,
  } = useAirtable({
    tableName: "Task Lists",
  });

  return taskLists ? (
    <Autocomplete
      multiple
      options={taskLists}
      disableCloseOnSelect
      getOptionLabel={(option: any) => option.Name}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option.Name}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Task Lists" placeholder="" />
      )}
      onChange={(e, value) => onValueChange(value)}
    />
  ) : (
    <TextField label="Task Lists" sx={{ width: "100%" }} />
  );
}
