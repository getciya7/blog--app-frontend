import React, { createContext, useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { URL } from "../url";

// Initial state for the user context
const initialState = {
  user: null,
  loading: true,
  error: null,
};

// Actions
const SET_USER = "SET_USER";
const REMOVE_USER = "REMOVE_USER";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

// Reducer function to handle state updates
const userReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case REMOVE_USER:
      return {
        ...state,
        user: null,
        loading: false,
        error: null,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

// Create context
const UserContext = createContext();

// Provider component
const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {
    const fetchUser = async () => {
      dispatch({ type: SET_LOADING });
      try {
        const res = await axios.get(`${URL}/api/auth/refetch`, {
          withCredentials: true,
        });
        dispatch({ type: SET_USER, payload: res.data });
      } catch (err) {
        dispatch({
          type: SET_ERROR,
          payload: err.response?.data.message || "An error occurred",
        });
      }
    };
    fetchUser();
  }, []);

  const login = (userData) => {
    dispatch({ type: SET_USER, payload: userData });
  };

  const logout = () => {
    dispatch({ type: REMOVE_USER });
  };

  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
const useUser = () => {
  return useContext(UserContext);
};

export { UserContextProvider, useUser };
