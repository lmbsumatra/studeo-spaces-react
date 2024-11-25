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
import { baseApiUrl, baseSocketUrl } from "../../App";

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
        const response = await axios.get(`${baseApiUrl}notifications`);
        setNotifications(response.data);
        setUnreadCount(response.data.filter((notif) => !notif.is_read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const socket = io(`${baseSocketUrl}:3002`, { transports: ["websocket"] });

    // Fetch notifications on mount
    fetchNotifications();

    // Poll for notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 20000);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      socket.disconnect();
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      setUnreadCount(0); // Mark notifications as read
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseApiUrl}notifications/${id}`);
      setNotifications(notifications.filter((notif) => notif.id !== id));
      setUnreadCount(unreadCount - 1);
      toast.info("Notification removed.");
    } catch (error) {
      toast.error("Failed removing notification.");
      console.error("Error deleting notification:", error);
    }
  };

  // Function to format notification and provide corresponding URL for redirection
  const formatNotification = (notification) => {
    const { type, customer_name, message, related_data_id } = notification;
    let formattedMessage = "";
    let redirectTo = "";

    switch (type) {
      case "payment":
        formattedMessage = `${customer_name} has made a payment: ${message}`;
        redirectTo = `/messages/${related_data_id}`; // Redirect to messages for payment notification
        break;
      case "booking":
        formattedMessage = `${customer_name} has a new booking: ${message}`;
        redirectTo = `admin/bookings?highlight=${related_data_id}`; // Redirect to bookings for booking notification
        break;
      case "message":
        formattedMessage = `${customer_name} sent you a message: ${message}`;
        redirectTo = `/admin/messages?highlight=${related_data_id}`; // Redirect to messages for message notification
        break;
        case "cancelbooking":
        formattedMessage = `${customer_name} has a new booking: ${message}`;
        redirectTo = `admin/bookings?highlight=${related_data_id}`; // Redirect to bookings for booking notification
        break;
      default:
        formattedMessage = `You have a new notification: ${message}`;
        redirectTo = `/admin/messages?highlight=${related_data_id}`; // Default route for other types of notifications
        break;
    }

    return { formattedMessage, redirectTo };
  };

  const handleNotificationClick = (notification) => {
    const { redirectTo } = formatNotification(notification);
    navigate(redirectTo); // Navigate to the relevant page
    setShowNotifications(false); // Close the notification popup after a notification is clicked
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
                {notifications.map((notif) => {
                  const { formattedMessage, redirectTo } = formatNotification(notif);
                  return (
                    <div
                      key={notif.id}
                      className="notification-item"
                      onMouseEnter={(e) => e.currentTarget.classList.add("hover")}
                      onMouseLeave={(e) => e.currentTarget.classList.remove("hover")}
                      onClick={() => handleNotificationClick(notif)} // Handle notification click
                    >
                      <p>{formattedMessage}</p>
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
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
