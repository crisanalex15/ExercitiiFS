import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "./style.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div className="header-content">
        <h1 className="header-title">🚀 Garage Manager</h1>
        <div className="header-buttons">
          {/* Navigation Buttons */}
          <button onClick={() => navigate("/")} className="btn btn-nav">
            🚗 Mașini
          </button>
          <button
            onClick={() => navigate("/motociclete")}
            className="btn btn-nav"
          >
            🏍️ Motociclete
          </button>
          <button onClick={() => navigate("/engines")} className="btn btn-nav">
            🔧 Motoare
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default Header;
