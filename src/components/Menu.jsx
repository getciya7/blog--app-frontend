import { useUser } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${URL}/api/auth/logout`, { withCredentials: true });
      logout(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-black w-48 z-20 flex flex-col items-start absolute top-12 right-0 md:right-6 rounded-md p-4 space-y-2 shadow-lg">
      {!user ? (
        <>
          <Link
            to="/login"
            className="text-white text-sm hover:text-gray-400 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-white text-sm hover:text-gray-400 transition"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <Link
            to={`/profile/${user._id}`}
            className="text-white text-sm hover:text-gray-400 transition"
          >
            Profile
          </Link>
          <Link
            to="/write"
            className="text-white text-sm hover:text-gray-400 transition"
          >
            Create Blog
          </Link>
          <Link
            to={`/myblogs/${user._id}`}
            className="text-white text-sm hover:text-gray-400 transition"
          >
            My Blogs
          </Link>
          <button
            onClick={handleLogout}
            className="text-white text-sm hover:text-gray-400 transition focus:outline-none"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Menu;
