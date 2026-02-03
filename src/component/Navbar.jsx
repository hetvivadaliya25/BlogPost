import React, { useContext, useState } from "react";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaMoon } from "react-icons/fa";
import { MdLightMode } from "react-icons/md";
import ConfirmationModal from "./ConfirmationModel";
import EditProfileModal from "./EditProfileModal";
import ModeContext from "../context/ModeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const ctx = useContext(ModeContext);
  console.log(ctx,"Context value");
  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};
  console.log(loggedInUserData);
  
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const userInitial = loggedInUserData?.role?.charAt(0).toUpperCase();

  const showModalHandler = () => {
    setShowModal(true);
  };
  const hideModalHandler = () => {
    console.log("Modal Close");
    setShowModal(false);
  };
  const logoutHandler = () => {
    console.log("logout");
    localStorage.removeItem("loginData");
    setShowModal(false);
    navigate("/login");
  };

  const saveProfileHandler = (updatedData) => {
    localStorage.setItem("loginData", JSON.stringify(updatedData));
    setShowEditModal(false);
  };

  // const handleLogout = (e) => {
  //   e.preventDefault(); // stop the Link from navigating immediately

  //   // Remove data from localStorage
  //   localStorage.removeItem("postData");
  //   localStorage.removeItem("loginData");

  //   // Show the toast
  //   toast.success("Logout Successfully !");

  //   // Navigate after a short delay so toast can be seen
  //   setTimeout(() => {
  //     navigate("/login");
  //   }, 1000);
  // };

  return (
    <>
      {" "}
      <nav className={`navbar ${ctx.mode == "dark" ? "nav-dark" : "nav-light"}`}>
        <h2>BlogPost</h2>
        {/* <ToastContainer /> */}
        <ul className="menu">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>
          
          {loggedInUserData?.role === "admin" ? (
            <li>
              <NavLink
                to="/new-post"
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                New Post
              </NavLink>
            </li>
          ) : (
            <></>
          )}

          <li>
            <NavLink
              to="/explore-page"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Explore Post
            </NavLink>
          </li>

          <li>
            <NavLink onClick={showModalHandler}>Logout</NavLink>
          </li>
        </ul>
        {loggedInUserData.role && <p>{loggedInUserData.role}</p>}
        <div className="darkmode" onClick={ctx.toggleMode}>
          {/* {ctx.mode == "dark" ? "Light" : "Dark"} */}
          {ctx.mode === "dark" ? (
            <>
              <MdLightMode size={20} /> Light
            </>
          ) : (
            <>
              <FaMoon size={20} /> Dark
            </>
          )}

          <div className="profile-class" onClick={() => setShowEditModal(true)}>
            {userInitial}
          </div>
        </div> 
      </nav>

      {/* Edit Profile Modal */}
      {showEditModal && 
        <EditProfileModal
          onClose={() => setShowEditModal(false)}
          // userData={loggedInUserData?.id}
          userId={loggedInUserData?.id}
          onConfirm={saveProfileHandler}
          confirmBtnText="Update"
      />}

      {/* Logout Confirmation Modal */}
      {showModal && (
        <ConfirmationModal
          title="Logout?"
          desc="You are about to log out, are you sure?"
          onClose={hideModalHandler}
          onConfirm={logoutHandler}
          confirmBtnText="Logout"
        />
      )}

    </>
  );
};
export default Navbar;
