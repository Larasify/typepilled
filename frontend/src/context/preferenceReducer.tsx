import { type Action, type PreferenceState } from './PreferenceContext';

const reducer = (state: PreferenceState, action: Action) => {
  switch (action.type) {
    case 'SET_TYPE':
      if (typeof window !== undefined) {
        window.localStorage.setItem('type', action.payload);
      }
      return {
        ...state,
        type: action.payload,
      };
    case 'SET_TIME':
      if (typeof window !== undefined) {
        window.localStorage.setItem('time', action.payload);
      }
      return {
        ...state,
        time: action.payload,
      };
    default:
      throw new Error('Unknown action type');
  }
};

export default reducer;