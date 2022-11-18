import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <div className="wrapper">
      <Header></Header>
      <Sidebar></Sidebar>
      <Footer></Footer>
    </div>
  );
}

export default App;
