import { useContext, useEffect, useState } from "react";
import "./CreatePostForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Loader from "../component/Loader";
import "react-toastify/dist/ReactToastify.css";
import ModeContext from "../context/ModeContext";

const CreatePostForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editPostId = location.state?.id || null;
  const ctx = useContext(ModeContext);

  const [createPostFormData, setCreatePostFormData] = useState({
    title: "",
    body: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Auto fill data in edit mode
  useEffect(() => {
    if (!editPostId) return;

    const posts = JSON.parse(localStorage.getItem("postData")) || [];
    const postToEdit = posts.find((p) => p.id === editPostId);

    if (postToEdit) {
      setCreatePostFormData({
        title: postToEdit.title,
        body: postToEdit.body,
        image: postToEdit.image,
      });
    }
  }, [editPostId]);

  const handleChange = (field, value) => {
    setErrors((e) => ({ ...e, [field]: "" }));
    setCreatePostFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleImageChange = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((e) => ({
        ...e,
        image: "Only JPG/JPEG, PNG images are allowed",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCreatePostFormData((prev) => ({
        ...prev,
        image: reader.result,
      }));
      setErrors((e) => ({ ...e, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!createPostFormData.title.trim()) newErrors.title = "Title is required";
    if (!createPostFormData.body.trim()) newErrors.body = "Body is required";
    if (!createPostFormData.image.trim()) newErrors.image = "Image is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const existingPosts = JSON.parse(localStorage.getItem("postData")) || [];

    // EDIT MODE
    if (editPostId) {
      const updatedPosts = existingPosts.map((p) =>
        p.id === editPostId ? { ...p, ...createPostFormData } : p
      );

      localStorage.setItem("postData", JSON.stringify(updatedPosts));

      setLoading(true);

      setTimeout(() => {
        setLoading(false); //  loader OFF
        toast.success("Post Updated Successfully");

        setTimeout(() => {
          navigate("/");
        }, 1000); // toast દેખાવા time
      }, 2000); // loader duration

      return;
    }

    // ADD MODE
    const updatedPosts = [
      ...existingPosts,
      { id: uuidv4(), ...createPostFormData },
    ];

    localStorage.setItem("postData", JSON.stringify(updatedPosts));

    setLoading(true);

    setTimeout(() => {
      setLoading(false); //  loader OFF
      toast.success("Post Added Successfully");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }, 2000);
  };

  return (
    <>
      {/* Loader Overlay */}
      {loading && <Loader />}
      <div className={`createpostform-class ${ctx.mode}`}>
        <div className={`page ${loading ? "blur-bg" : ""}`}>
          <ToastContainer />
          <h1>{editPostId ? "Let's Edit Post" : "Let's Create New Post"}</h1>

          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter Title"
              value={createPostFormData.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && <span className="error">{errors.title}</span>}

            <textarea
              placeholder="Enter Body"
              rows="5"
              value={createPostFormData.body}
              onChange={(e) => handleChange("body", e.target.value)}
            />
            {errors.body && <span className="error">{errors.body}</span>}

            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => handleImageChange(e.target.files[0])}
            />
            {errors.image && <span className="error">{errors.image}</span>}

            {createPostFormData.image && (
              <img
                src={createPostFormData.image}
                alt="Preview"
                style={{ width: 100, height: 100, borderRadius: 10 }}
              />
            )}

            <div className="btn-group">
              {editPostId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

              <button type="submit">
                {editPostId ? "Update Post" : "Add Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePostForm;
