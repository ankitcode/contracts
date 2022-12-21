import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = () => {
    //console.log("Logout");
    let user = { userData: [{ isAdmin: false }] };
    dispatch({ type: "logout", user: user });
    navigate("/login");
    //localStorage.removeItem('isAthenticated');
  };
  return (
    <>
      {/* Navbar */}
      <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        {/* Left navbar links */}
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="/#"
              role="button"
            >
              <i className="fas fa-bars" />
            </a>
          </li>
          <li className="nav-item d-none d-sm-inline-block">
            <Link to="" className="nav-link">
              Home
            </Link>
          </li>
        </ul>
        {/* Right navbar links */}
        <ul className="navbar-nav ml-auto">
          {/* Navbar Search */}
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="navbar-search"
              href="/#"
              role="button"
            >
              <i className="fas fa-search" />
            </a>
            <div className="navbar-search-block">
              <form className="form-inline">
                <div className="input-group input-group-sm">
                  <input
                    className="form-control form-control-navbar"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-navbar" type="submit">
                      <i className="fas fa-search" />
                    </button>
                    <button
                      className="btn btn-navbar"
                      type="button"
                      data-widget="navbar-search"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          <li className="nav-item">
            <Button onClick={handleLogOut} className="logoutBtn">
              <i className="logoutBtnIcon fas fa-sign-out-alt fa-1x" />
            </Button>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="fullscreen"
              href="/#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt" />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Header;
