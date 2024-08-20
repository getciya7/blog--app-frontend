import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { URL } from "../url";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { MdArrowBack } from "react-icons/md";

// Define validation schema with Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post(URL + "/api/auth/forgot-password", {
        email: values.email,
      });
      toast.success("Password reset email sent", {
        theme: "colored",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong", {
        theme: "colored",
      });
    }
    setSubmitting(false);
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 md:px-16 py-4 bg-gray-100">
        <h1 className="text-lg md:text-2xl font-extrabold">
          <Link to="/" className="hover:text-gray-600">
            Blog App
          </Link>
        </h1>
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col justify-center items-center space-y-6 w-[85%] md:w-[30%] p-6 bg-white shadow-lg rounded-lg">
          <div className="flex items-start justify-start mt-5 mb-4">
            <MdArrowBack
              className="text-gray-600 cursor-pointer items-start mr-2 mt-1 hover:text-black transition"
              size={24}
              onClick={() => navigate(-1)} // Navigates to the previous page
            />
            <h1 className="text-2xl font-bold text-start ">Forgot Password</h1>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="w-full space-y-5">
                <div>
                  <Field
                    type="text"
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
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 text-lg font-bold text-white bg-black rounded-lg hover:bg-gray-600 transition-all"
                >
                  {isSubmitting ? "Sending..." : "Send reset link"}
                </button>
              </Form>
            )}
          </Formik>
          <div className="flex justify-center items-center space-x-2">
            <p>Back to</p>
            <Link to="/login" className="text-gray-500 hover:text-black">
              login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
