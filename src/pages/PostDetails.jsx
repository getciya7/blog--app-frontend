import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { URL, IF } from "../url";
import { useUser } from "../context/UserContext";
import Comment from "../components/Comment";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { BiEdit } from "react-icons/bi";
import {
  MdArrowBack,
  MdDelete,
  MdFavorite,
  MdFavoriteBorder,
} from "react-icons/md";
import { toast } from "react-toastify";
import ShareButtons from "../components/ShareButtons";

const PostDetails = () => {
  const postId = useParams().id;
  const [post, setPost] = useState({});
  const { user } = useUser();
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loader, setLoader] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();

  const fetchPostComments = async () => {
    setLoader(true);
    try {
      const res = await axios.get(`${URL}/api/comments/post/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.log("Error fetching comments:", err);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${URL}/api/posts/${postId}`);

        // Check if the photo property exists in the response
        if (res.data.photo) {
          console.log("Post photo URL:", res.data.photo); // Log photo URL
        } else {
          console.log("Photo property is missing from the response");
        }

        setPost(res.data);
        setLikeCount(res.data.likes.length);
        setLiked(res.data.likes.includes(user?._id));
      } catch (err) {}
    };

    fetchPost();
    fetchPostComments();
  }, [postId, user?._id]);

  const handleLike = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!user) {
      toast.warn("You need to log in to like this post!");
    }

    if (!token) {
      toast.error("Token not found. Please log in again.");
    }

    try {
      await axios.post(
        `${URL}/api/posts/${postId}/like`,
        { likes: liked },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Ensure this is the correct token
          },
        }
      );
      setLikeCount((prev) => prev + 1); // Increment like count
      setLiked(true); // Update liked status
    } catch (err) {
      console.log("Error liking the post. Please try again.");
    }
  };

  const handleUnlike = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!user) {
      toast.warn("You need to log in to unlike this post!");
    }

    if (!token) {
      toast.error("Token not found. Please log in again.");
    }

    try {
      await axios.put(
        `${URL}/api/posts/${postId}/unlike`,
        { likes: false },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Ensure this is the correct token
          },
        }
      );
      setLikeCount((prev) => prev - 1); // Decrement like count
      setLiked(false); // Update liked status
    } catch (err) {
      toast.error("Error unliking the post. Please try again.");
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!user) {
      toast.warn("You need to log in to delete this post!");
    }

    if (!token) {
      toast.error("Token not found. Please log in again.");
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) {
      return; // Exit the function if the user cancels
    }

    try {
      await axios.delete(`${URL}/api/posts/${postId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`, // Use token from local storage
        },
      });
      navigate("/");
    } catch (err) {
      toast.error("Error deleting post. Please try again.");
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from local storage
    if (!user) {
      toast.warn("You need to log in to comment on this post!");
    }

    if (!token) {
      toast.error("Token not found. Please log in again.");
    }

    try {
      await axios.post(
        `${URL}/api/comments/create`,
        {
          comment: comment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Use token from local storage
          },
        }
      );
      setComment("");
      fetchPostComments();
    } catch (err) {
      console.log("Error posting comment. Please try again.");
    }
  };

  const postUrl = `${window.location.origin}/post/${postId}`;
  const postTitle = post.title;

  return (
    <>
      {" "}
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        {loader ? (
          <div className="h-[80vh] flex justify-center items-center w-full">
            <Loader />
          </div>
        ) : (
          <div className="container mx-auto px-4 md:px-8 mt-8 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center mt-5 mb-4">
                <MdArrowBack
                  className="text-gray-600 cursor-pointer hover:text-black transition"
                  size={24}
                  onClick={() => navigate(-1)} // Navigates to the previous page
                />
                <h1 className="text-2xl font-bold text-gray-900 md:text-3xl ml-4">
                  {post.title}
                </h1>
              </div>
              {user?._id === post.userId && (
                <div className="flex items-center space-x-2">
                  <p
                    className="cursor-pointer text-gray-600 hover:text-black transition"
                    onClick={() => navigate(`/edit/${postId}`)}
                  >
                    <BiEdit size={24} />
                  </p>
                  <p
                    className="cursor-pointer text-red-600 hover:text-red-800 transition"
                    onClick={handleDeletePost}
                  >
                    <MdDelete size={24} />
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-gray-600 text-sm mb-4">
              <p>@{post.username}</p>
              <div className="flex space-x-4">
                <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
                <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
              </div>
            </div>
            {post.photo && (
              <img
                src={post.photo}
                className="mx-auto rounded-lg shadow-md max-w-full max-h-98"
                alt={post.title}
              />
            )}

            <p className="mt-4 text-gray-800">{post.desc}</p>
            <div className="flex items-center mt-6 space-x-4">
              <p className="font-semibold text-gray-700">Categories:</p>
              <div className="flex flex-wrap space-x-2">
                {post.categories?.map((c, i) => (
                  <span
                    key={i}
                    className="bg-gray-300 text-gray-700 rounded-full px-3 py-1 text-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center mt-4 space-x-2">
              {liked ? (
                <MdFavorite
                  className="text-red-600 cursor-pointer hover:text-red-800 transition"
                  size={24}
                  onClick={handleUnlike}
                />
              ) : (
                <MdFavoriteBorder
                  className="text-gray-600 cursor-pointer hover:text-gray-800 transition"
                  size={24}
                  onClick={handleLike}
                />
              )}
              <p className="text-gray-700">{likeCount} Likes</p>
              <ShareButtons url={postUrl} title={postTitle} />
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Comments:
              </h3>
              {comments.length ? (
                comments.map((c) => (
                  <Comment
                    key={c._id}
                    c={c}
                    post={post}
                    refreshComments={fetchPostComments}
                  />
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row mt-6">
              <input
                onChange={(e) => setComment(e.target.value)}
                type="text"
                placeholder="Write a comment"
                className="flex-1 border border-gray-300 rounded-lg py-2 px-4 mb-6 outline-none focus:border-gray-500"
                value={comment}
              />
              <button
                onClick={postComment}
                className="bg-black text-white text-sm rounded-lg px-4 py-2 mb-6 ml-2 mt-2 md:mt-0"
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PostDetails;
