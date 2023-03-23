import React, { useEffect, useState } from "react";
import { FaBars, FaBook, FaHome } from "react-icons/fa";
import { MdAudiotrack, MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import "/src/styles/sidebar.scss";

export default function Sidebar({ user, setUser }) {
  const [toggleSmall, setToggleSmall] = useState(false);
  const [sidebarClass, setSidebarClass] = useState("sidebar-box");

  useEffect(() => {
    if (toggleSmall) {
      setSidebarClass("sidebar-box sidebar-active");
    } else {
      setSidebarClass("sidebar-box");
    }
  }, [toggleSmall]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("wbd-token");
    window.location.replace(
      window.location.href.replace(window.location.pathname, "") + "/login"
    );
    alert("Logout success");
  };

  return (
    <div className="sidebar">
      <div className="small-sidebar">
        <img src="/logo-white.png" alt="" className="small-logo" />
        <div
          className="small-right"
          onClick={() => {
            setToggleSmall(!toggleSmall);
          }}
        >
          <FaBars className="sidebar-icon" />
        </div>
      </div>

      <div className={sidebarClass}>
        <img src="/logo-white.png" alt="" className="sidebar-logo" />
        <Link to="/" className="sidebar-list">
          <button className="sidebar-btn home-btn">
            <FaHome className="sidebar-icon" size={18} />
            Home
          </button>
        </Link>

        {user?.role == "singer" ? (
          <Link to="/songs" className="sidebar-list">
            <button className="sidebar-btn home-btn">
              <MdAudiotrack className="sidebar-icon" size={18} />
              Songs
            </button>
          </Link>
        ) : (
          ""
        )}

        {user?.role == "admin" ? (
          <Link to="/subscription" className="sidebar-list">
            <button className="sidebar-btn home-btn">
              <FaBook className="sidebar-icon" size={18} />
              Subscription
            </button>
          </Link>
        ) : (
          ""
        )}

        {user ? (
          <div className="sidebar-list" onClick={handleLogout}>
            <button className="sidebar-btn home-btn">
              <MdOutlineLogout className="sidebar-icon" size={18} />
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="sidebar-list">
            <button className="sidebar-btn home-btn">
              <MdOutlineLogin className="sidebar-icon" size={18} />
              Login
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
