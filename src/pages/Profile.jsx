import React, { useReducer, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { URL } from "../url";
import { useUser } from "../context/UserContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  profileReducer,
  profileActionTypes,
} from "../context/reducers/ProfileReducer";
import Loader from "../components/Loader";

const Profile = () => {
  const param = useParams().id;
  const { user, loading: userLoading, logout } = useUser();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(profileReducer, {
    username: "",
    email: "",
    posts: [],
    updated: false,
    error: null,
    emailError: null,
    passwordError: null,
  });

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const fetchProfile = async () => {
    if (!user || !user._id) {
      console.error("User is not logged in.");
      return;
    }
    try {
      const res = await axios.get(`${URL}/api/users/${user._id}`);
      dispatch({
        type: profileActionTypes.SET_PROFILE,
        payload: { username: res.data.username, email: res.data.email },
      });
    } catch (err) {
      console.log(err);
      dispatch({ type: profileActionTypes.SET_ERROR, payload: err.message });
    }
  };

  const fetchUserPosts = async () => {
    if (!user || !user._id) {
      console.error("User is not logged in.");
      return;
    }
    try {
      const res = await axios.get(`${URL}/api/posts/user/${user._id}`);
      dispatch({ type: profileActionTypes.SET_POSTS, payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: profileActionTypes.SET_ERROR, payload: err.message });
    }
  };

  const handleUserUpdate = async () => {
    const isEmailValid = validateEmail(state.email);

    if (!isEmailValid) {
      dispatch({
        type: profileActionTypes.SET_EMAIL_ERROR,
        payload: "Invalid email format.",
      });
      return;
    }

    try {
      const res = await axios.put(
        `${URL}/api/users/${user._id}`,
        {
          username: state.username,
          email: state.email,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({ type: profileActionTypes.SET_UPDATED, payload: true });
      dispatch({ type: profileActionTypes.CLEAR_ERROR }); // Clear any existing errors
    } catch (err) {
      if (err.response && err.response.data.message) {
        dispatch({
          type: profileActionTypes.SET_EMAIL_ERROR,
          payload: err.response.data.message,
        });
      } else {
        console.log(err);
        dispatch({
          type: profileActionTypes.SET_ERROR,
          payload: "Update failed. Please try again.",
        });
      }
    }
  };

  const handleUserDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      const password = prompt("Please enter your password to confirm:");
      if (!password) {
        alert("Password is required to delete the profile.");
        return;
      }
      try {
        await axios.delete(`${URL}/api/users/${user._id}`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          data: {
            password, // Send the password to the backend for verification
          },
        });
        logout(); // Log the user out after deletion
        navigate("/"); // Navigate to home page
      } catch (err) {
        console.error(err);

        if (err.response && err.response.status === 404) {
          // If 404 error, consider it as already deleted and navigate away
          logout();
          navigate("/");
        } else {
          alert(
            "Failed to delete profile. Please check your password and try again."
          );
        }
      }
    }
  };

  useEffect(() => {
    if (user && !userLoading) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [user, userLoading, param]);

  if (userLoading) {
    return (
      <div className="h-[40vh] flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-[40vh] flex justify-center items-center">
        <h3 className="text-center font-bold mt-16">
          Please log in to view your profile.
        </h3>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-[80vh] px-6 md:px-[150px] mt-8 flex md:flex-row flex-col space-y-8 md:space-y-0 md:space-x-12">
        {/* Posts Section */}
        <div className="md:w-[65%] w-full">
          <h1 className="text-3xl font-bold mb-4">Your Posts</h1>
          {state.posts.length === 0 ? (
            <p className="text-gray-500 text-lg">
              You have no posts yet. Create one to get started!
            </p>
          ) : (
            <div className="flex flex-col space-y-4">
              {state.posts.map((p) => (
                <ProfilePosts key={p._id} p={p} />
              ))}
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="md:w-[35%] w-full md:sticky md:top-12 flex flex-col items-start space-y-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <div className="space-y-4 w-full">
            <input
              onChange={(e) =>
                dispatch({
                  type: profileActionTypes.SET_PROFILE,
                  payload: { ...state, username: e.target.value },
                })
              }
              value={state.username}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your username"
              type="text"
            />
            <input
              onChange={(e) =>
                dispatch({
                  type: profileActionTypes.SET_PROFILE,
                  payload: { ...state, email: e.target.value },
                })
              }
              value={state.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
              type="email"
            />
            {state.emailError && (
              <p className="text-red-500 text-sm">{state.emailError}</p>
            )}
            <div className="text-center items-center justify-center flex w-full">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-white bg-black py-3 px-20 rounded text-sm"
              >
                Change Password
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-4 w-full mt-8">
            <button
              onClick={handleUserUpdate}
              className="flex-1 bg-black text-white font-semibold py-3 rounded-md hover:bg-gray-700 transition-colors duration-300"
            >
              Update
            </button>
            <button
              onClick={handleUserDelete}
              className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition-colors duration-300"
            >
              Delete
            </button>
          </div>

          {state.updated && (
            <h3 className="text-green-500 text-sm text-center mt-4">
              User updated successfully!
            </h3>
          )}
          {state.error && (
            <h3 className="text-red-500 text-sm text-center mt-4">
              {state.error}
            </h3>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
