import PropTypes from "prop-types";
import { IF } from "../url";
import React from "react";

const HomePosts = ({ post }) => {
  return (
    <div className="w-full flex flex-col md:flex-row mt-8 space-y-4 md:space-y-0 md:space-x-6 bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
      {/* Left: Image */}
      <div className="md:w-[40%] h-[200px] flex justify-center items-center rounded-lg overflow-hidden">
        <img
          src={post.photo}
          alt={post.title || "Post image"}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right: Content */}
      <div className="flex flex-col md:w-[60%]">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">{post.title}</h1>
        <div className="flex justify-between items-center text-gray-500 mb-4">
          <p className="font-semibold">@{post.username}</p>
          <div className="flex space-x-4 text-sm">
            <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
            <p>{new Date(post.updatedAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm md:text-base leading-relaxed">
          {post.desc.slice(0, 200)}{" "}
          <span className="text-blue-600 font-medium">...Read more</span>
        </p>
      </div>
    </div>
  );
};

HomePosts.propTypes = {
  post: PropTypes.shape({
    photo: PropTypes.string,
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default React.memo(HomePosts);
