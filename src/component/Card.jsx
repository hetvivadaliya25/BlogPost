import "./Card.css";
import React, { useContext, useState } from "react";
import ModeContext from "../context/ModeContext";

function Card(props) {
  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};
  const ctx = useContext(ModeContext);

  return (
    <div className={`card ${ctx.mode}`}>
      <div className="icon-center" onClick={props.onRedirect}>
        <img className="img-icon" src={props.image ? props.image : `https://picsum.photos/seed/${Date.now()}/200/300`} alt="" />
      </div>
      <div className="card-title-class">
        <h1 className="title-class-h1">{props.title}</h1>
        </div>
        <div className="card-desc-class">
        <p>
          {props.desc.length > 100
            ? props.desc.substring(0, 100) + "..."
            : props.desc}
        </p>
      </div>
      {loggedInUserData?.role === "admin" && (
      // {props.from !== "explore" && loggedInUserData?.role === "admin" && (
      // {props.from !== "explore" &&
        <div className="div2">
          <button className="btn1" onClick={props.onEdit}>Edit</button>
          <button className="btn1" onClick={props.onDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};
export default Card;
