import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export const SEARCH_MODES = {
  QUERY: "query",
  AI: "ai"
};

const AI_INTRO_KEY = "olog-ai-intro-seen";

export const defaultSearchModeState = {
  mode: SEARCH_MODES.QUERY,
  aiAnalysisEnabled: false,
  aiQuery: "",
  aiIntroSeen: window.localStorage.getItem(AI_INTRO_KEY) === "true"
};

export const searchModeSlice = createSlice({
  name: "searchMode",
  initialState: defaultSearchModeState,
  reducers: {
    setSearchMode: (state, action) => ({
      ...state,
      mode: action.payload
    }),
    toggleAiAnalysis: (state) => ({
      ...state,
      aiAnalysisEnabled: !state.aiAnalysisEnabled
    }),
    setAiQuery: (state, action) => {
      if (action.payload) {
        window.localStorage.setItem(AI_INTRO_KEY, "true");
      }
      return {
        ...state,
        aiQuery: action.payload,
        aiIntroSeen: state.aiIntroSeen || Boolean(action.payload)
      };
    },
    dismissAiIntro: (state) => {
      window.localStorage.setItem(AI_INTRO_KEY, "true");
      return { ...state, aiIntroSeen: true };
    }
  }
});

export const { setSearchMode, toggleAiAnalysis, setAiQuery, dismissAiIntro } =
  searchModeSlice.actions;

export const useSearchMode = () => useSelector((state) => state.searchMode);

export default searchModeSlice.reducer;