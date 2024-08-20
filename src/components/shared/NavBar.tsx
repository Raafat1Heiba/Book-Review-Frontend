import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/nav.css";

const Navbar = () => {
  const { auth, setAuth }: any = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAuth({ token: "" });
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">
          Book Store
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {auth.token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user">
                    <i className="bi bi-person-circle text-white font-size"></i>
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-white text-white"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/signup">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
