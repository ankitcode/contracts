import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="content-wrapper login-page">
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
              <p className="login-box-msg" ><h3>Welcome to WR-II Contracts App</h3></p>
              <form action="/" method="post">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="600*****"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-user"></span>
                    </div>
                  </div>
                </div>
                <div className="input-group mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                  />
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
