import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { URL } from "../url";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(
        8,
        "Password must contain 8 or more characters with one special character"
      )
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${URL}/api/auth/register`, values);
      setSubmitting(false);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      setSubmitting(false);
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred during registration.");
      }
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
          <Link to="/login" className="hover:text-gray-600">
            Login
          </Link>
        </h3>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center items-center space-y-6 w-[85%] md:w-[30%] p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-left w-full">
            Create an account
          </h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="w-full space-y-5">
                <div>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-black outline-none"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
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
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-black outline-none"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-600 transition-all"
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="flex justify-center items-center space-x-2">
            <p>Already have an account?</p>
            <Link to="/login" className="text-gray-500 hover:text-black">
              Login here
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
