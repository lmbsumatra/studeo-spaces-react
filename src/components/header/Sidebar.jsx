import React from "react";
import { NavLink } from "react-router-dom";
import "./style.css";

import logo from "../../assets/images/studeo-spaces-logo.png";
import dashboardIcon from "../../assets/images/icons/dashboard.svg";
import bookingsIcon from "../../assets/images/icons/bookings.svg";
import customersIcon from "../../assets/images/icons/customers.svg";
import paymentsIcon from "../../assets/images/icons/payments.svg";
import messagesIcon from "../../assets/images/icons/messages.svg";
import contentManagementIcon from "../../assets/images/icons/content-management.svg";
import servicesIcon from "../../assets/images/icons/services.svg";
import blogsIcon from "../../assets/images/icons/blogs.svg";
import settingsIcon from "../../assets/images/icons/settings.svg";
import feedbackIcon from "../../assets/images/icons/feedback2.svg";

const links = [
  { path: "/admin/dashboard", label: "Dashboard", icon: dashboardIcon },
  { path: "/admin/bookings", label: "Bookings", icon: bookingsIcon },
  { path: "/admin/customers", label: "Customers", icon: customersIcon },
  { path: "/admin/payments", label: "Payments", icon: paymentsIcon },
  { path: "/admin/messages", label: "Messages", icon: messagesIcon },
  { path: "/admin/services", label: "Content Management", icon: contentManagementIcon, isDisabled: true }, // Mark as non-clickable
  { path: "/admin/services", label: "Services", icon: servicesIcon },
  { path: "/admin/feedbacks", label: "Feedback Management", icon: feedbackIcon },
  { path: "/admin/blogs", label: "Blogs", icon: blogsIcon },
  { path: "/admin/settings", label: "Settings", icon: settingsIcon },
];

const Sidebar = ({ isExpanded, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
      <NavLink to="/" className="navbar-brand">
        <img src={logo} alt="Logo" style={{ height: "50px", width: "50px", margin: "15px" }} />
      </NavLink>
      <button onClick={toggleSidebar} className="sidebar-toggle-btn">
        <img
          src={`../assets/images/icons/${isExpanded ? "xmark" : "menu"}.svg`}
          height="40px"
          width="40px"
          alt={isExpanded ? "Close Icon" : "Menu Icon"}
        />
      </button>
      <ul className="sidebar-nav">
        {links.map(({ path, label, icon, isDisabled }) => (
          <li
            key={path}
            className={`sidebar-item ${isExpanded && label !== "Dashboard" && label !== "Content Management" ? "indent" : "no-indent"}`}
          >
            {isDisabled ? (
              <span className="sidebar-link disabled-link">
                {isExpanded ? label : <img src={icon} alt={label} className="sidebar-icon icon-indent" />}
              </span>
            ) : (
              <NavLink to={path} className={({ isActive }) => (isActive ? "sidebar-link active-nav" : "sidebar-link")}>
                {isExpanded ? label : <img src={icon} alt={label} className="sidebar-icon icon-indent" />}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
