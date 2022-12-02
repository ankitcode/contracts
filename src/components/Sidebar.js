import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  
  return (
    <>
      {/* Main Sidebar Container */}
      <aside className="main-sidebar sidebar-dark-primary elevation-4">
        {/* Brand Logo */}
        <Link to="/home" className="brand-link">
          <img
            src="powergrid-logo.png"
            alt="POWERGRID Logo"
            className="brand-image img-square elevation-3"
            style={{ opacity: ".8", top: "10px", position: "relative" }}
          />
          <span className="brand-text font-weight-light">
            WR-II RHQ Contracts
          </span>
        </Link>
        {/* Sidebar */}
        <div className="sidebar">
          {/* Sidebar user panel (optional) */}
          <div className="user-panel mt-3 pb-3 mb-3 d-flex">
            <div className="image">
              <img
                src="dist/img/user2-160x160.jpg"
                alt="logged in user"
                className="img-circle elevation-2"
              />
            </div>
            <div className="info">
              <a href="#" className="d-block">
                Ankit
              </a>
            </div>
          </div>
          {/* SidebarSearch Form */}
          <div className="form-inline">
            <div className="input-group" data-widget="sidebar-search">
              <input
                className="form-control form-control-sidebar"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <div className="input-group-append">
                <button className="btn btn-sidebar">
                  <i className="fas fa-search fa-fw" />
                </button>
              </div>
            </div>
          </div>
          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul
              className="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              {/* Add icons to the links using the .nav-icon class
         with font-awesome or any other icon font library */}
              <li className="nav-item menu-open">
                <a href="#" className="nav-link active">
                  <i className="nav-icon fas fa-tachometer-alt" />
                  <p>
                    Dashboard
                    <i className="right fas fa-angle-left" />
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  <li className="nav-item">
                    <Link to="/home" className="nav-link">
                      {/*Added home icon from font awesome */}
                      <i className="fa fa-home nav-icon" />
                      <p>Home</p>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-file-contract" />
                  <p>
                    Contracts
                    <i className="fas fa-angle-left right" />
                    {/*<span className="badge badge-info right">6</span>*/}
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {/*Added two list items for adding contract and 
                  viewing added contracts and icons */}
                  <li className="nav-item">
                    <Link to="/addNew" className="nav-link">
                      <i className="fas fa-edit nav-icon" />
                      <p>Add New</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/viewContracts" className="nav-link">
                      <i className="fa fa-eye nav-icon" />
                      <p>View</p>
                    </Link>
                  </li>
                </ul>
              </li>

              {/*Added for Admin */}
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="nav-icon fas fa-solid fa-lock" />
                  <p>
                    Admin
                    <i className="fas fa-angle-left right" />
                    {/*<span className="badge badge-info right">6</span>*/}
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {/*Added two list items for adding contract and 
                  viewing added contracts and icons */}
                  <li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="fas fa-solid fa-user nav-icon" />
                      <p>Users</p>
                    </a>
                  </li>
                </ul>
              </li>

              {/*Added for Reports */}
              <li className="nav-item">
                <a href="#" className="nav-link">
                  <i className="fas fa-file nav-icon" />
                  <p>
                    Report
                    <i className="fas fa-angle-left right" />
                    {/*<span className="badge badge-info right">6</span>*/}
                  </p>
                </a>
                <ul className="nav nav-treeview">
                  {/*Added two list items for adding contract and 
                  viewing added contracts and icons */}
                  {/*<li className="nav-item">
                    <a href="#" className="nav-link">
                      <i className="fas fa-edit nav-icon" />
                      <p>Users</p>
                    </a>
                </li>*/}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
