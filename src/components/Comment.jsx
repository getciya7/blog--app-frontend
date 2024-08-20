import axios from "axios";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { URL } from "../url";
import { useUser } from "../context/UserContext";
import React, { useState } from "react";

const Comment = ({ c, post, refreshComments }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedComment, setUpdatedComment] = useState(c.comment);
  const [loading, setLoading] = useState(false); // Loading state

  const deleteComment = async (id) => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      await axios.delete(`${URL}/api/comments/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      refreshComments();
    } catch (err) {
      console.error("Error deleting comment:", err);
      // Optionally, show a user-friendly message here
    } finally {
      setLoading(false);
    }
  };

  const editComment = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);
    try {
      await axios.put(
        `${URL}/api/comments/${c._id}`,
        { comment: updatedComment },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setIsEditing(false);
      refreshComments();
    } catch (err) {
      console.error("Error editing comment:", err);
      // Optionally, show a user-friendly message here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2 py-2 bg-gray-200 rounded-lg my-2">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-600">@{c.author}</h3>
        <div className="flex items-center space-x-4">
          <p>{new Date(c.updatedAt).toLocaleDateString()}</p>
          <p>{new Date(c.updatedAt).toLocaleTimeString()}</p>
          {user?._id === c?.userId && (
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <button
                    onClick={editComment}
                    className="cursor-pointer text-blue-600"
                    aria-label="Save comment"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="cursor-pointer text-gray-600"
                    aria-label="Cancel edit"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer text-blue-600"
                    aria-label="Edit comment"
                  >
                    <BiEdit />
                  </button>
                  <button
                    onClick={() => deleteComment(c._id)}
                    className="cursor-pointer text-red-600"
                    aria-label="Delete comment"
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : <MdDelete />}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <input
          type="text"
          value={updatedComment}
          onChange={(e) => setUpdatedComment(e.target.value)}
          className="px-4 mt-2 w-full outline-none"
          aria-label="Edit comment text"
        />
      ) : (
        <p className="px-4 mt-2">{c.comment}</p>
      )}
    </div>
  );
};

export default React.memo(Comment);
