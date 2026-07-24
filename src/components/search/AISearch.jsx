import { IconButton, InputAdornment, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { TextInput } from "components/shared/input/TextInput";
import { setAiQuery, useSearchMode } from "features/searchModeReducer";

const AISearch = () => {
  const dispatch = useDispatch();
  const { aiQuery } = useSearchMode();
  const { control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: { question: aiQuery }
  });

  const questionValue = watch("question");

  const onSubmit = () => {
    console.log("ai submit", getValues());
    const { question } = getValues();
    dispatch(setAiQuery(question ?? ""));
  };

  return (
    <Stack
      component="form"
      gap={1}
      width="100%"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flex: 3,
        padding: "0 14px 0 30px",
        "& .MuiFormLabel-root[data-shrink='false']": {
          transform: "translate(14px, 14px)"
        }
      }}
    >
      <TextInput
        control={control}
        placeholder="AI Search"
        name="question"
        defaultValue=""
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AutoAwesomeIcon sx={{ height: "20px", width: "20px" }} />
            </InputAdornment>
          ),
          endAdornment: (
            <>
              {questionValue && (
                <IconButton
                  onClick={() => {
                    setValue("question", "");
                    dispatch(setAiQuery(""));
                  }}
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    padding: "4px",
                    marginRight: "-4px"
                  }}
                  fontSize="small"
                >
                  <ClearIcon sx={{ fontSize: "18px" }} />
                </IconButton>
              )}
            </>
          ),
          sx: {
            fontSize: ".9rem",
            backgroundColor: "#f5f5f5",
            "& .MuiInputBase-input": {
              padding: "10px 0",
              paddingRight: 0
            }
          }
        }}
      />
    </Stack>
  );
};

export default AISearch;