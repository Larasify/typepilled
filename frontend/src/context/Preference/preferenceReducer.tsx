import { type Action, type PreferenceState } from "./PreferenceContext";

const reducer = (state: PreferenceState, action: Action) => {
  switch (action.type) {
    case "SET_TYPE":
      if (typeof window !== undefined) {
        window.localStorage.setItem("type", action.payload);
      }
      return {
        ...state,
        type: action.payload,
      };
    case "SET_TIME":
      if (typeof window !== undefined) {
        window.localStorage.setItem("time", action.payload);
      }
      return {
        ...state,
        time: action.payload,
      };
    case "SET_WORDLENGTH":
      if (typeof window !== undefined) {
        window.localStorage.setItem("wordlength", action.payload);
      }
      return {
        ...state,
        wordlength: action.payload,
      };
    case "SET_QUOTELENGTH":
      if (typeof window !== undefined) {
        window.localStorage.setItem("quotelength", action.payload);
      }
      return {
        ...state,
        quotelength: action.payload,
      };
    case "SET_PUNCTUATION":
      if (typeof window !== undefined) {
        window.localStorage.setItem(
          "punctuation",
          JSON.stringify(action.payload)
        );
      }
      return {
        ...state,
        punctuation: action.payload,
      };
    case "SET_NUMBERS":
      if (typeof window !== undefined) {
        window.localStorage.setItem("numbers", JSON.stringify(action.payload));
      }
      return {
        ...state,
        numbers: action.payload,
      };
    case "SET_THEME":
      if (typeof window !== undefined) {
        window.localStorage.setItem("theme", action.payload);
      }
      return {
        ...state,
        theme: action.payload,
      };
    case "SET_CHAT_TYPE":
      if (typeof window !== undefined) {
        window.localStorage.setItem("chatType", JSON.stringify(action.payload));
      }
      return {
        ...state,
        chatType: action.payload,
      };
    case "TOGGLE_CHAT_TYPE":
      if (typeof window !== undefined) {
        window.localStorage.setItem("chatType", JSON.stringify(!state.chatType));
      }
      return {
        ...state,
        chatType: !state.chatType,
      };
      case "SET_NAV_TYPE":
      if (typeof window !== undefined) {
        window.localStorage.setItem("navType", JSON.stringify(action.payload));
      }
      return {
        ...state,
        navType: action.payload,
      };
    case "TOGGLE_NAV_TYPE":
      if (typeof window !== undefined) {
        window.localStorage.setItem("navType", JSON.stringify(!state.navType));
      }
      return {
        ...state,
        navType: !state.navType,
      };
    default:
      throw new Error("Unknown action type");
  }
};

export default reducer;
