import React from 'react';
import { NavLink } from 'react-router-dom';
// import './AdminHeader.css'; // Assuming you have CSS for your admin header

const AdminHeader = () => {
  return (
    <nav className="navbar">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink to="/admin/dashboard" className="navbar-brand">
          <img
            src="./assets/logo/studeo-spaces-logo.png"
            alt="Studeo Spaces Logo"
            style={{ height: '50px', width: '50px' }}
          />
        </NavLink>

        {/* Admin Nav Items */}
        <div>
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/bookings"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Users
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/services"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/payments"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Reports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/settings"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Settings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/feedback"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Feedback
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/audit-logs"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Audit Logs
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/admin/backup"
                className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}
              >
                Backup
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminHeader;
