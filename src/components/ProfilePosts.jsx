import PropTypes from "prop-types";
import { IF } from "../url";
import { Link } from "react-router-dom";

const ProfilePosts = ({ p }) => {
  return (
    <div className="w-full flex flex-col md:flex-row mt-8 bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 space-y-4 md:space-y-0 md:space-x-6">
      {/* Left: Image */}
      <div className="md:w-[35%] w-full h-[200px] flex justify-center items-center rounded-lg overflow-hidden">
        <img
          src={p.photo}
          alt={`Image for ${p.title}`}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Right: Content */}
      <div className="flex flex-col md:w-[65%] w-full">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {p.title}
        </h1>
        <div className="flex justify-between items-center text-gray-500 mb-4">
          <p className="font-semibold">@{p.username}</p>
          <div className="flex space-x-4 text-sm">
            <p>{new Date(p.updatedAt).toLocaleDateString()}</p>
            <p>{new Date(p.updatedAt).toLocaleTimeString()}</p>
          </div>
        </div>
        <p className="text-sm md:text-lg text-gray-700 leading-relaxed">
          {p.desc.slice(0, 200)}{" "}
          <Link
            to={`/posts/post/${p._id}`}
            className="text-blue-600 font-medium"
          >
            ...Read more
          </Link>
        </p>
      </div>
    </div>
  );
};

// Adding PropTypes to enforce the structure of props
ProfilePosts.propTypes = {
  p: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfilePosts;
