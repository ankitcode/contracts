// Imports
import React from "react";
import axios from "../axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  // redux store reducer dispatch
  const dispatch = useDispatch();
  // to redirect upon login
  const navigate = useNavigate();

  // axios headers config
  let axiosConfig = {
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  };

  // Validation for employee number and password on login page
  const validationSchema = Yup.object({
    empNo: Yup.string()
      .matches(/^(600\d{5})$/gi, "Invalid Employee Number")
      .required("Required!"),
    password: Yup.string().required("Required!"),
  });

  return (
    <>
      <div className="login-page">
        <div className="login-box">
          <div className="card">
            <div className="card-header">
              <div className="login-logo">
                <img
                  src="dist/img/powergrid.png"
                  alt="POWERGRID"
                  width="300"
                  height="100"
                />
              </div>
            </div>
            <div className="card-body login-card-body">
              <h3>
                <p className="login-box-msg">Welcome to WR-II Contracts App</p>
              </h3>

              <Formik
                initialValues={{
                  empNo: "",
                  password: "",
                }}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setSubmitting(false);
                  try {
                    // Call login API
                    const res = await axios.post(
                      "/api/auth/login",
                      values,
                      axiosConfig
                    );

                    if (res.data.success) {
                      toast.success(res.data.msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                      });
                      axiosConfig.headers["authToken"] = res.data.authToken;
                      // Get User Data
                      const userData = await axios.post(
                        "/api/auth/getUser",
                        {},
                        axiosConfig
                      );
                      let user = {
                        authToken: res.data.authToken,
                        userData: userData.data.user,
                      };
                      dispatch({ type: "login", user: user });
                      navigate("/");
                    } else {
                      toast.error(res.data.msg, {
                        position: "top-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                      });
                    }
                  } catch (error) {
                    toast.error(error.response.data.msg, {
                      position: "top-right",
                      autoClose: 1000,
                      hideProgressBar: true,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: false,
                      progress: undefined,
                      theme: "light",
                    });
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="600*****"
                        name="empNo"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.empNo}
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-user"></span>
                        </div>
                      </div>
                    </div>
                    {errors.empNo && touched.empNo ? (
                      <div className="input-group mb-3">
                        <ErrorMessage name="empNo">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    ) : null}
                    <div className="input-group mb-3">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">
                          <span className="fas fa-lock"></span>
                        </div>
                      </div>
                    </div>
                    {errors.password && touched.password ? (
                      <div className="input-group mb-3">
                        <ErrorMessage name="password">
                          {(msg) => <div style={{ color: "red" }}>{msg}</div>}
                        </ErrorMessage>
                      </div>
                    ) : null}
                    <div className="row">
                      <div className="col-12">
                        <button
                          type="submit"
                          onClick={handleSubmit}
                          className="btn btn-primary btn-block"
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
