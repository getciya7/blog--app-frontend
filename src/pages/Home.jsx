import axios from "axios";
import Footer from "../components/Footer";
import HomePosts from "../components/HomePosts";
import Navbar from "../components/Navbar";
import { URL } from "../url";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Loader from "../components/Loader";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";

const Home = () => {
  const { search } = useLocation();
  const [posts, setPosts] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [loading, setLoading] = useState(true); // Initialize as true
  const { user } = useUser();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/api/posts${search}`);
      setPosts(res.data);
      setNoResults(res.data.length === 0);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="px-8 md:px-[200px] min-h-[80vh]">
        {loading ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResults ? (
          posts.map((post) => (
            <Link key={post._id} to={`/posts/post/${post._id}`}>
              <HomePosts post={post} />
            </Link>
          ))
        ) : (
          <div className="text-center font-bold mt-16">
            <h3>No posts available</h3>
            <p className="mt-2 text-gray-600">
              Check back later or try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Home;
