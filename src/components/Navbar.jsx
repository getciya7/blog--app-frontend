import { Link, useLocation, useNavigate } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import Menu from "./Menu";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const [prompt, setPrompt] = useState("");
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { user } = useUser();

  const showMenu = () => {
    setMenu(!menu);
  };

  const handleSearch = () => {
    navigate(prompt ? `?search=${prompt}` : "/");
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-12 py-4 bg-black text-white shadow-md">
      <h1 className="text-lg md:text-xl font-extrabold">
        <Link to="/" className="hover:text-gray-400 transition">
          Blog App
        </Link>
      </h1>
      {path === "/" && (
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="flex items-center bg-white rounded-md overflow-hidden">
            <input
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="outline-none px-3 py-1 border-none text-black w-full"
              placeholder="Search a post"
              type="text"
              aria-label="Search"
            />
            <button
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition"
              onClick={handleSearch}
              aria-label="Search Button"
            >
              <BsSearch className="text-black" />
            </button>
          </div>
        </div>
      )}
      <div className="hidden md:flex items-center space-x-4">
        {user ? (
          <div onClick={showMenu} className="relative cursor-pointer">
            <FaBars className="hover:text-gray-400 transition" />
            {menu && <Menu />}
          </div>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-400 transition">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-400 transition">
              Register
            </Link>
          </>
        )}
      </div>
      <div
        onClick={showMenu}
        className="md:hidden text-lg cursor-pointer relative"
      >
        <FaBars className="hover:text-gray-400 transition" />
        {menu && <Menu />}
      </div>
    </nav>
  );
};

export default Navbar;
