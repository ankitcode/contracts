import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ViewContracts from "./components/Contents/ViewContracts";
import Home from "./components/Contents/Home";

//Import for router, routes and route
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddNew from "./components/Contents/AddNew";

function App() {
  return (
    <div className="wrapper">
      {/* Add components on page */}
      <Router>
        <Header />
        <Sidebar />
        <Footer />
        {/*Define routes */}
        <Routes>
          <Route path="/" element=<Home /> />
          <Route path="/home" element=<Home /> />
          <Route path="/addNew" element=<AddNew /> />
          <Route path="/viewContracts" element=<ViewContracts /> />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
