import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { ImCross } from "react-icons/im";
import axios from "axios";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { MdArrowBack } from "react-icons/md";
import { toast } from "react-toastify";

const EditPost = () => {
  const { id: postId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch post data
  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/posts/${postId}`);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setImageUrl(res.data.photo);
      setCats(res.data.categories);
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch post data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  // Handle post update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !desc) {
      toast.warn("Title and description are required!");
      return;
    }

    setLoading(true);
    let photoURL = "";

    // Handle file upload
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

    // Handle post update
    try {
      const res = await axios.put(`${URL}/api/posts/${postId}`, post, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Post updated successfully!");
      navigate(`/posts/post/${res.data._id}`);
    } catch (err) {
      console.log(err);
      toast.error("Error updating post.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileType = selectedFile.type.split("/")[0];
      const fileSizeLimit = 5 * 1024 * 1024; // 5MB size limit

      if (fileType !== "image") {
        toast.warn("Only image files are allowed!");
        return;
      }

      if (selectedFile.size > fileSizeLimit) {
        toast.warn("File size should be less than 5MB!");
        return;
      }

      setFile(selectedFile);
    }
  };

  // Add category
  const addCategory = () => {
    if (cat.trim() === "" || cats.includes(cat.trim())) {
      toast.warn("Category is empty or already added.");
      return;
    }
    setCats([...cats, cat.trim()]);
    setCat("");
  };

  // Delete category
  const deleteCategory = (index) => {
    setCats(cats.filter((_, i) => i !== index));
  };

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <div className="flex items-center mt-5 mb-4">
          <MdArrowBack
            className="text-gray-600 cursor-pointer hover:text-black transition"
            size={24}
            onClick={() => navigate(-1)} // Navigates to the previous page
          />
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl ml-4">
            Update a Post
          </h1>
        </div>
        <form
          className="w-full flex flex-col space-y-6 md:space-y-8 mt-4"
          onSubmit={handleUpdate}
        >
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 border rounded-md border-gray-300 outline-none"
          />

          {imageUrl && (
            <div className="relative mb-4">
              <img
                src={imageUrl}
                alt="Post"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}

          <input
            onChange={handleFileChange}
            type="file"
            className="px-4 py-2 border rounded-md border-gray-300"
          />

          <div className="flex flex-col">
            <div className="flex items-center space-x-4 md:space-x-8">
              <input
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                className="px-4 py-2 border rounded-md border-gray-300 outline-none"
                placeholder="Enter post category"
                type="text"
              />
              <button
                type="button"
                onClick={addCategory}
                className="bg-black text-white px-4 py-2 font-semibold rounded-md cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap mt-3 px-4">
              {cats.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center space-x-2 mr-4 mb-2 bg-gray-200 px-3 py-1 rounded-md"
                >
                  <p>{c}</p>
                  <button
                    onClick={() => deleteCategory(i)}
                    className="text-white bg-black rounded-full p-1 text-sm"
                  >
                    <ImCross />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <textarea
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
            rows={10}
            className="px-4 py-2 border rounded-md border-gray-300 outline-none"
            placeholder="Enter post description"
          />
          <button
            type="submit"
            className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
