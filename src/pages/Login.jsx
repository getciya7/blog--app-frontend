import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { URL } from "../url";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await axios.post(`${URL}/api/auth/login`, values, {
        withCredentials: true,
      });

      const { token, ...user } = res.data;

      if (token && user) {
        localStorage.setItem("token", token);
        login(user);
        toast.success("Login Successful", {
          theme: "colored",
        });
        navigate("/");
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      setErrors({ general: "Something went wrong" });
      toast.error(err.response?.data?.message || "An error occurred", {
        theme: "colored",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-16 py-4 bg-gray-100">
        <h1 className="text-lg md:text-2xl font-extrabold">
          <Link to="/" className="hover:text-gray-600">
            Blog App
          </Link>
        </h1>
        <h3 className="text-md md:text-lg">
          <Link to="/register" className="hover:text-gray-600">
            Register
          </Link>
        </h3>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center items-center space-y-6 w-[85%] md:w-[30%] p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-left w-full">Welcome Back,</h1>
          <h2 className="text-lg font-semibold text-left w-full">
            Login to your account!
          </h2>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="w-full space-y-5">
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-black outline-none"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-black outline-none"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="flex justify-end items-center">
                  <Link
                    to="/forgot-password"
                    className="text-gray-500 hover:text-black"
                  >
                    Forgot password?
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-600 transition-all"
                >
                  {isSubmitting ? "Logging in..." : "Log in"}
                </button>
                <ErrorMessage
                  name="general"
                  component="div"
                  className="text-red-500 text-center text-sm mt-2"
                />
              </Form>
            )}
          </Formik>
          <div className="flex justify-center items-center space-x-2">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-gray-500 hover:text-black">
              Register here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
