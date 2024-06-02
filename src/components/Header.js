import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  // Check if the path is for admin or user
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <nav className="navbar">
      <div className="container-fluid">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand">
          <img
            src="./assets/logo/studeo-spaces-logo.png"
            alt="Studeo Spaces Logo"
            style={{ height: '50px', width: '50px' }}
          />
        </NavLink>

        {/* Nav Items */}
        <div>
          <ul className="navbar-nav">
            {isAdminPath ? (
              // Render admin navigation
              <>
                <li className="nav-item">
                  <NavLink exact to="/admin" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin-bookings" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Bookings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin-customers" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Customers
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin-payments" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Payments
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/admin-messages" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Messages
                  </NavLink>
                </li>
              </>
            ) : (
              // Render user navigation
              <>
                <li className="nav-item">
                  <NavLink exact to="/" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Blogs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/services" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    Services
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/faqs" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
                    FAQs
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/booking" className={({ isActive }) => (isActive ? 'nav-link active-nav' : 'nav-link')}>
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
