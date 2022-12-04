import ViewContracts from "./components/Contents/ViewContracts";
import Home from "./components/Contents/Home";

//Import for router, routes and route
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNew from "./components/Contents/AddNew";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import ManageUsers from "./components/Contents/ManageUsers";

import { useSelector } from "react-redux";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";

function App() {
  //console.log("I'm at App!");
  //const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const trees = window.$('[data-widget="treeview"]');
    trees.Treeview("init");
    //if (localStorage.getItem("isAuthentication")) {
    //setIsAuthenticated(true);
    //} else {
    //setIsAuthenticated(false);
    //}
  }, []);

  const { isAuthenticated } = useSelector((state) => state.root);
  
  return (
    <div className="wrapper">
      {/* Add components on page */}
      <Router>
        {/*Define routes */}
        <Routes>
          <Route
            path="/manageUsers"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={true}
              >
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            exact path="/"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
              >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            exact path="/home"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={false}
                isAdmin={false}
              >
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            exact path="/addNew"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={false}
                isAdmin={false}
              >
                <AddNew />
              </ProtectedRoute>
            }
          />
          <Route
            exact path="/viewContracts"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={false}
                isAdmin={false}
              >
                <ViewContracts />
              </ProtectedRoute>
            }
          />
          
          <Route path="/login" element=<Login /> />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
