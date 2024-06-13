import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

import logo from "../../assets/images/studeo-spaces-logo.png";

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      {/* Logo */}
      <NavLink to="/" className="navbar-brand">
        <img src={logo} alt="Logo" style={{ height: "50px", width: "50px", margin: "15px"}} />
      </NavLink>
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        {!isExpanded ? (
          <img
            src="../assets/images/icons/menu.svg"
            height="40px"
            width="40px"
            alt="Menu Icon"
          />
        ) : (
          <img
            src="../assets/images/icons/xmark.svg"
            height="40px"
            width="40px"
            alt="Close Icon"
          />
        )}
      </button>
      <ul className="sidebar-nav">
        <li className="sidebar-item">
          <NavLink
            exact
            to="/admin-dashboard"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-bookings"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Bookings
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-customers"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Customers
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-payments"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Payments
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-messages"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Messages
          </NavLink>
        </li>
        <hr/>
        <li className="sidebar-item">
          <NavLink
            to="/content-management"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Content Management
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-services"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Services
          </NavLink>
        </li>
        <li className="sidebar-item indent">
          <NavLink
            to="/admin-blogs"
            className={({ isActive }) =>
              isActive ? "sidebar-link active-nav" : "sidebar-link"
            }
          >
            Blogs
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
