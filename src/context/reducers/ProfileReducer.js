// ProfileReducer.js
export const profileActionTypes = {
  SET_PROFILE: "SET_PROFILE",
  SET_POSTS: "SET_POSTS",
  SET_UPDATED: "SET_UPDATED",
  SET_ERROR: "SET_ERROR",
  SET_EMAIL_ERROR: "SET_EMAIL_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const initialState = {
  username: "",
  email: "",
  posts: [],
  updated: false,
  error: null,
  emailError: null,
};

export const profileReducer = (state, action) => {
  switch (action.type) {
    case profileActionTypes.SET_PROFILE:
      return {
        ...state,
        username: action.payload.username,
        email: action.payload.email,
      };
    case profileActionTypes.SET_POSTS:
      return {
        ...state,
        posts: action.payload,
      };
    case profileActionTypes.SET_UPDATED:
      return {
        ...state,
        updated: action.payload,
      };
    case profileActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case profileActionTypes.SET_EMAIL_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case profileActionTypes.CLEAR_ERROR:
      return { ...state, error: null, emailError: null, passwordError: null };
    default:
      return state;
  }
};
