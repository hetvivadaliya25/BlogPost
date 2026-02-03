import "./PostDetail.css";
import { useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModel";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function PostDetail() {
  const [showModal, setShowModal] = useState(false);
  const loggedInUserData = JSON.parse(localStorage.getItem("loginData")) || {};
  const postData = JSON.parse(localStorage.getItem("postData")) || [];
  const { postId } = useParams(); //used to get dynamic value from url

  const [currentPost, setCurrentPost] = useState({}); //used to store single post data
  const navigate = useNavigate();

  useEffect(() => {
    //find() method - apply only on array, return single object
    const filtered = postData.find(
      (item) => String(item.id) === String(postId)
    );
    console.log({ postData, postId, filtered });
    if (filtered) setCurrentPost(filtered);
  }, [postId]);

  const handleEdit =(id) =>{
    console.log({id});
    //pass data from one page to another page
    navigate("/new-post", {state: {id:postId}});
   }

  const onConfirmDelete = () => {
    // 1. Filter out the current post from postData
    const updatedPosts = postData.filter(
      (item) => String(item.id) !== String(postId)
    );
    // 2. Save the updated array back to localStorage
    localStorage.setItem("postData", JSON.stringify(updatedPosts));
    // 3. Close the modal
    setShowModal(false);

    // 4. Navigate to home page
    navigate("/");
  };

  return (
    <>
      <div className="postdetail-container">
        <div className="postdetail-left">
          <img
            src={currentPost.image || "/img1.jpg"}
            className="images"
            alt="priview"
          />
        </div>

        <div className="postdetail-right">
          <div className="detail-1">
            <h2>{currentPost.title}</h2>
            <h3>{currentPost.body}</h3>
          </div>

          {loggedInUserData?.role === "admin" ? (
          <div className="btns">
            <button className="btndelete" onClick={() => setShowModal(true)}>
              Delete
            </button>
            <button className="btnedit" onClick={() => handleEdit()}>Edit</button>
          </div>
           ) : (
            <></>
          )}

        </div>
      </div>

      {showModal && (
        <ConfirmationModal
          title="Delete"
          desc="Are you sure you want to delete this post?"
          onClose={() => setShowModal(false)}
          onConfirm={() => onConfirmDelete(true)}
          confirmBtnText="yes"
        />
      )}
    </>
  );
}
