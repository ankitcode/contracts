import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    //console.log("Login");
    dispatch({type: "login"});
   {/* <Navigate to={"/"} />*/}
   //localStorage.setItem('isAthenticated', true);
   navigate('/');

  }
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
              <h3><p className="login-box-msg" >Welcome to WR-II Contracts App</p></h3>
              <form > 
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
                    <button type="button" onClick={handleLogin} className="btn btn-primary btn-block">
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
