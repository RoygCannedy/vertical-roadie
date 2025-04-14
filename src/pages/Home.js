import logo from '../assets/logo-vertical.png';

function Home() {
  return (
    <div className="hero-wrapper">
      <div className="hero-banner">
        <img src={logo} alt="Vertical Roadie Logo" className="hero-logo" />
        <h1 className="hero-title">Welcome to Vertical Roadie</h1>
        <p className="hero-subtitle">Organize. Equip. Empower your setup crew.</p>
        <a href="/inventory-view" className="btn hero-btn">View Inventory</a>
      </div>
    </div>
  );
}

export default Home;
