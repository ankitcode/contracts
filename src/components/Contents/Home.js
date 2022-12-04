import React from "react";
import { Link } from "react-router-dom";

import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "../Sidebar";

const Home = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Footer />
      <div className="content-wrapper">
        <section className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1>Dashboard</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Dashboard</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="content" id="scrollingCard">
          <div className="container-fluid">
            
          <img
            src="dist/img/under_construction.png"
            alt="Under Construction"
            className="brand-image img-square elevation-1"
            style={{ opacity: "1", top: "1px", position: "relative" }}
          />
            
            
            </div>
        </section>
      </div>
    </>
  );
};

export default Home;
