import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import EditableInventory from './pages/EditableInventory';
import ViewInventory from './pages/ViewInventory';
import Setups from './pages/Setups';
import Instructions from './pages/Instructions';
import './index.css';

function App() {
  return (
    <Router>
      <div>
        <nav className="nav-bar">
          <Link to="/">Home</Link>
          <Link to="/inventory-edit">Inventory (Edit)</Link>
          <Link to="/inventory-view">Inventory (View)</Link>
          <Link to="/setups">Setups</Link>
          <Link to="/instructions">Instructions</Link>
        </nav>
        <div className="page-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inventory-edit" element={<EditableInventory />} />
            <Route path="/inventory-view" element={<ViewInventory />} />
            <Route path="/setups" element={<Setups />} />
            <Route path="/instructions" element={<Instructions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
