import React, { useContext, useState, useEffect } from "react";
import Card from "../component/Card";
import ConfirmationModal from "../component/ConfirmationModel";
import { useNavigate } from "react-router-dom";
import Snowfall from "react-snowfall";
import "../pages/HomePage.css";
import { BiSolidUpArrowSquare } from "react-icons/bi";
import ModeContext from "../context/ModeContext";

export function HomePage() {
  const [allPostData, setAllPostData] = useState(
    JSON.parse(localStorage.getItem("postData")) || []
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const navigate = useNavigate();
  const ctx = useContext(ModeContext);

  // Load posts from localStorage on mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("postData")) || [];
    setAllPostData(storedData);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const openDeleteModal = (index) => {
    console.log(index, "Index");
    setSelectedIndex(index);
    setShowModal(true);
  };

  const clickHandler = (id) => {
    navigate(`/posts/${id}`);
  };

  const confirmDelete = () => {
    const updatedPostData = allPostData.filter((_, i) => i !== selectedIndex);
    console.log(updatedPostData, "UpdatedData");
    setAllPostData(updatedPostData);
    localStorage.setItem("postData", JSON.stringify(updatedPostData));
    setShowModal(false);
  };

  const handleEdit = (id) => {
    console.log({ id });
    //pass data from one page to another page
    navigate("/new-post", { state: { id } });
  };

  return (
    <>
    <div className={`container-home ${ctx.mode}`}>
      <span id="top" className="span-top"></span>
      <h1 style={{color:"white", textAlign: "center", paddingTop: "10px"}}></h1>
      <h1>Created Post</h1>
      <div className={`container ${ctx.mode}`}>
        {allPostData.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          allPostData.map((item, index) => {
            console.log("item", item);
            return (
              <Card
                key={item.id || index}
                title={item.title}
                desc={item.body}
                image={item.image}
                onDelete={() => openDeleteModal(index)}
                onRedirect={() => clickHandler(item.id)}
                onEdit={() => handleEdit(item.id)}
              />
            );
          })
        )}
      </div>
    
      <div className="scroll-top-wrapper">
        <BiSolidUpArrowSquare
          size={50}
          style={{ cursor: "pointer" }}
          onClick={() => scrollToSection("top")}
        />
      </div>
      </div>


      {showModal && (
        <ConfirmationModal
          title="Delete Post"
          desc="Are you sure you want to delete this post? This action cannot be done."
          onConfirm={confirmDelete}
          onClose={() => setShowModal(false)}
          confirmBtnText="Delete"
        />
      )}

      <Snowfall color="#367083" snowflakeCount={700} speed={[0.12, 0.6]} />
    </>
  );
}
