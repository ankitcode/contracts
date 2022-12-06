import ViewContracts from "./Components/Contents/ViewContracts";
import Home from "./Components/Contents/Home";

//Import for router, routes and route
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNew from "./Components/Contents/AddNew";
import { useState, useEffect } from "react";
import Login from "./Components/Login";
import ManageUsers from "./Components/Contents/ManageUsers";

import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Sidebar from "./Components/Sidebar";
import { ToastContainer } from "react-toastify";

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.root);
  const [isAdmin, setIsAdmin] = useState(false);
  //console.log(user, isAdmin);
  useEffect(() => {
    if("userData" in user)
    setIsAdmin(user.userData[0].isAdmin);
  });
  
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
