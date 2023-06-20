import * as React from "react";
import reducer from "./preferenceReducer";

export type PreferenceState = {
  type: string;
  time: string;
  wordlength: string;
  quotelength: string;
  punctuation: boolean;
  numbers: boolean;
  theme: string;
};

export type Action =
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_TIME"; payload: string }
  | { type: "SET_WORDLENGTH"; payload: string }
  | { type: "SET_QUOTELENGTH"; payload: string }
  | { type: "SET_PUNCTUATION"; payload: boolean }
  | { type: "SET_NUMBERS"; payload: boolean }
  | { type: "SET_THEME"; payload: string};

export type ProviderState = {
  preferences: PreferenceState;
  dispatch: React.Dispatch<Action>;
};

const PreferenceContext = React.createContext({} as ProviderState);

export default function PreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, dispatch] = React.useReducer(reducer, {
    type: "words",
    time: "30",
    wordlength: "25",
    quotelength: "medium",
    punctuation: false,
    numbers: false,
    theme: "forest",
  });

  React.useEffect(() => {
    if (typeof window !== undefined) {
      const type = window.localStorage.getItem("type");
      const time = window.localStorage.getItem("time");
      const wordlength = window.localStorage.getItem("wordlength");
      const quotelength = window.localStorage.getItem("quotelength");
      const punctuation = window.localStorage.getItem("punctuation");
      const numbers = window.localStorage.getItem("numbers");
      const theme = window.localStorage.getItem("theme");
      if (type) dispatch({ type: "SET_TYPE", payload: type });
      if (time) dispatch({ type: "SET_TIME", payload: time });
      if (wordlength) dispatch({ type: "SET_WORDLENGTH", payload: wordlength });
      if (quotelength) dispatch({ type: "SET_QUOTELENGTH", payload: quotelength });
      if (punctuation) dispatch({ type: "SET_PUNCTUATION", payload: punctuation === 'true' });
      if (numbers) dispatch({ type: "SET_NUMBERS", payload: numbers === 'true' });
      if (theme) dispatch({ type: "SET_THEME", payload: theme });
    }
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferenceContext = () => React.useContext(PreferenceContext);
