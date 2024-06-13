import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import user from "../../assets/images/icons/user.svg";
import notif from "../../assets/images/icons/notif.svg";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate()

  const isAdminPath = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('token');
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand">
        </NavLink>

        {/* Nav Items */}
        <div>
          <ul className="navbar-nav">
            {isAdminPath ? (
              // Render admin navigation
              <>
                <li className="nav-item">
                    <img src={user} height="40px"/>
                </li>
                <li className="nav-item">
                    <img src={notif} height="40px"/>
                </li>
                <li className="nav-item" onClick={handleLogout}>
                    Log Out
                </li>
              </>
            ) : (
              // Render user navigation
              <>
                <li className="nav-item">
                  <NavLink
                    exact
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-nav" : "nav-link"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-nav" : "nav-link"
                    }
                  >
                    Blogs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-nav" : "nav-link"
                    }
                  >
                    Services
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/faqs"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-nav" : "nav-link"
                    }
                  >
                    FAQs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/booking"
                    className={({ isActive }) =>
                      isActive ? "nav-link active-nav" : "nav-link"
                    }
                  >
                    <button className="btn btn-primary-clr">Book now!</button>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
