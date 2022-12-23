// Imports
import React from "react";
import Home from "./Components/Contents/Home";
import ViewContracts from "./Components/Contents/ViewContracts";
import AddNew from "./Components/Contents/AddNew";
import ManageUsers from "./Components/Contents/ManageUsers";
import Login from "./Components/Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

function App() {
  // Getting isAuthenticated and isAdmin for current logged in user from redux store
  const { isAuthenticated, isAdmin } = useSelector((state) => state.root);
  // Initializing treeview for sidebar
  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
  }, []);

  return (
    <div className="wrapper">
      {/* Add components on page */}
      <Router>
        {isAuthenticated ? (
          <>
            <Header />
            <Sidebar />
            <Footer />
          </>
        ) : null}
        {/*Define routes */}
        <Routes>
          <Route
            path="/manageUsers"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={isAdmin}
              >
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/home"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/addNew"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddNew />
              </ProtectedRoute>
            }
          />
          <Route
            exact
            path="/viewContracts"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <ViewContracts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Home /> : <Login />}
          />
        </Routes>
      </Router>
      {/*React toast container component for showing notifications*/}
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
