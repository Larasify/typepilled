import * as React from "react";
import reducer from "./preferenceReducer";

export type PreferenceState = {
  type: string;
  time: string;
};

export type Action =
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_TIME"; payload: string };


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
    time: "15",
  });

  React.useEffect(() => {
    if (typeof window !== undefined) {
      const type = window.localStorage.getItem("type");
      const time = window.localStorage.getItem("time");
      if (type) dispatch({ type: "SET_TYPE", payload: type });
      if (time) dispatch({ type: "SET_TIME", payload: time });
    }
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferenceContext = () => React.useContext(PreferenceContext);
