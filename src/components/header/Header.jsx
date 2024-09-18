import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import user from "../../assets/images/icons/user.svg";
import notif from "../../assets/images/icons/notif.svg";
import "./style.css";
import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

dayjs.extend(relativeTime);

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isAdminPath = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/notifications");
        setNotifications(response.data);
        setUnreadCount(response.data.filter((notif) => !notif.is_read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications on initial load
    fetchNotifications();

    // Set up polling
    const intervalId = setInterval(fetchNotifications, 1000); // Poll every 60 seconds

    // Initialize Socket.IO connection
    const socket = io("http://127.0.0.1:8000");

    socket.on("new_notification", (newNotification) => {
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      setUnreadCount((prevCount) => prevCount + 1);
    });

    // Clean up interval and Socket.IO connection on component unmount
    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/notifications/${id}`);
      setNotifications(notifications.filter((notif) => notif.id !== id));
      toast.info("Notification removed.");
    } catch (error) {
      toast.error("Failed removing notification.");
      console.error("Error deleting notification:", error);
    }
  };

  const formatNotification = (notification) => {
    const { type, customer_name, message } = notification;
    switch (type) {
      case "payment":
        return `${customer_name} has made a payment: ${message}`;
      case "booking":
        return `${customer_name} has a new booking: ${message}`;
      case "message":
        return `${customer_name} sent you a message: ${message}`;
      default:
        return `${customer_name} has a new notification: ${message}`;
    }
  };

  return (
    <nav className="navbar">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand"></NavLink>
        <div>
          <ul className="navbar-nav">
            {isAdminPath ? (
              <>
                <li className="nav-item">
                  <img src={user} height="40px" alt="User Icon" />
                </li>
                <li
                  className={`nav-item btn-notif ${showNotifications ? "active" : ""}`}
                >
                  <img
                    src={notif}
                    height="40px"
                    alt="Notification Icon"
                    onClick={toggleNotifications}
                  />
                  {unreadCount > 0 && (
                    <span className="notification-counter">{unreadCount}</span>
                  )}
                </li>
                <li className="nav-item" onClick={handleLogout}>
                  Log Out
                </li>
              </>
            ) : (
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

          {showNotifications && (
            <div className="notification-popup active">
              <div className="popup-header">
                <h5>Notifications</h5>
                <button
                  className="close-popup"
                  onClick={() => setShowNotifications(false)}
                >
                  X
                </button>
              </div>
              <div className="popup-content">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="notification-item"
                    onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
                    onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
                  >
                    <p>{formatNotification(notif)}</p>
                    <span className="timestamp">
                      {dayjs(notif.created_at).fromNow()}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(notif.id)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
