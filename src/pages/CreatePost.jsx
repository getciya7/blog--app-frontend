import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ImCross } from "react-icons/im";
import { useUser } from "../context/UserContext";
import { URL } from "../url";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { user } = useUser();
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteCategory = (index) => {
    setCats((prevCats) => prevCats.filter((_, i) => i !== index));
  };

  const addCategory = () => {
    if (cat.trim() === "") {
      toast.warn("Category cannot be empty!");
      return;
    }
    setCats((prevCats) => [...prevCats, cat.trim()]);
    setCat("");
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!title || !desc) {
      toast.warn("Title and description are required!");
      return;
    }

    setLoading(true);
    let photoURL = "";

    if (file) {
      const data = new FormData();
      data.append("file", file);

      try {
        const response = await axios.post(`${URL}/api/upload`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        photoURL = response.data.url;
        if (!photoURL) {
          toast.error("Failed to upload image.");
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error("Upload Error:", err);
        toast.error("Error uploading file. Please try again.");
        setLoading(false);
        return;
      }
    }

    const post = {
      title,
      desc,
      username: user.username,
      userId: user._id,
      categories: cats,
      photo: photoURL,
    };

    try {
      const res = await axios.post(`${URL}/api/posts/create`, post, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Post created successfully!");
      navigate("/posts/post/" + res.data._id);
    } catch (err) {
      console.error("Create Post Error:", err);
      toast.error("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-12 lg:px-32 mt-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Create a Post</h1>
        <form
          className="w-full flex flex-col space-y-6 md:space-y-8 bg-white p-6 md:p-8 rounded-lg shadow-lg"
          onSubmit={handleCreate}
        >
          <input
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter post title"
            value={title}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            className="w-full text-gray-700 border border-gray-300 rounded-md py-2 px-4"
          />
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter post category"
                type="text"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-black text-white px-4 py-2 font-semibold rounded-md shadow-md hover:bg-gray-800"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap space-x-2 mt-3">
              {cats.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-200 px-3 py-1 rounded-md shadow-sm"
                >
                  <p className="text-gray-800">{category}</p>
                  <button
                    onClick={() => deleteCategory(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <ImCross />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter post description"
            value={desc}
          />
          <button
            type="submit"
            className="bg-black text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-800"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CreatePost;
