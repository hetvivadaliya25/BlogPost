import { useContext, useEffect, useState } from "react";
import "./ExplorePosts.css";
import { FaSearch } from "react-icons/fa";
import Card from "../component/Card";
import { Pagination } from "./Pagination";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModel";
import Loader from "../component/Loader";
import ModeContext from "../context/ModeContext";

const ExplorePosts = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const ctx = useContext(ModeContext);

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({ title: "", body: "" });
  const [errors, setErrors] = useState({});

  const loggedInUserData = JSON.parse(localStorage.getItem("loginData"));

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://696b4aaf624d7ddccaa0b883.mockapi.io/blogpostdata"
      );
      if (!res.ok) throw new Error("Failed to load posts");

      const data = await res.json();
      const reversed = [...data].reverse();

      setPosts(reversed);
      setFilteredPosts(reversed);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= SEARCH =================
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);

    const result = posts.filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.body.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPosts(result);
  };

  // ================= FORM HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.body.trim()) newErrors.body = "Body is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const url = editId
        ? `https://696b4aaf624d7ddccaa0b883.mockapi.io/blogpostdata/${editId}`
        : "https://696b4aaf624d7ddccaa0b883.mockapi.io/blogpostdata";

      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          image: `https://picsum.photos/seed/${Date.now()}/300/200`,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(editId ? "Post Updated" : "Post Created");

      setFormData({ title: "", body: "" });
      setEditId(null);
      setIsFormOpen(false);

      fetchPosts();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://696b4aaf624d7ddccaa0b883.mockapi.io/blogpostdata/${id}`
      );
      const data = await res.json();
      setFormData({ title: data.title, body: data.body });
      setEditId(id);
      setIsFormOpen(true);
    } catch {
      toast.error("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://696b4aaf624d7ddccaa0b883.mockapi.io/blogpostdata/${deleteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();

      toast.success("Post deleted successfully");
      setShowModal(false);
      fetchPosts();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
      setDeleteId(null);
    }
  };

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filteredPosts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentItems = filteredPosts.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <>
      {loading && <Loader />}

      <div className={`explore-container ${ctx.mode} ${loading ? "blur-bg" : ""}`}>
        <ToastContainer />

        <div className="explore-posts">
          <h1>Explore Posts</h1>
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="input-box"
              placeholder="Search Posts"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Admin only */}
        {loggedInUserData?.role === "admin" && (
          <button
            className="btn5"
            onClick={() => setIsFormOpen(!isFormOpen)}
          >
            {isFormOpen ? "Close Form" : "Create New Post"}
          </button>
        )}

        {loggedInUserData?.role === "admin" && isFormOpen && (
          <form className="form-container" onSubmit={handleSubmit}>
            <h3>{editId ? "Update Post" : "Create New Post"}</h3>

            <input
              type="text"
              name="title"
              placeholder="Enter Title"
              value={formData.title}
              onChange={handleChange}
              className="input-class"
            />
            {errors.title && <p className="error">{errors.title}</p>}

            <textarea
              name="body"
              placeholder="Enter Body"
              rows="4"
              value={formData.body}
              onChange={handleChange}
              className="input-class"
            />
            {errors.body && <p className="error">{errors.body}</p>}

            <div>
              <button className="btn4" type="submit">
                {editId ? "Update" : "Submit"}
              </button>
              <button
                type="button"
                className="btn4"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditId(null);
                  setFormData({ title: "", body: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <hr />

        <div className="card-container">
          {!loading && currentItems.length === 0 ? (
            <p className="no-data">No Data Found</p>
          ) : (
            !loading &&
            currentItems.map((item) => (
              <Card
                key={item.id}
                id={item.id}
                title={item.title}
                desc={item.body}
                image={item.image}
                onEdit={() => handleEdit(item.id)}
                onDelete={() => handleDelete(item.id)}
              />
            ))
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          onPageSizeChange={(size) => {
            setPageSize(Number(size));
            setCurrentPage(1);
          }}
        />

        {showModal && (
          <ConfirmationModal
            title="Delete Post"
            desc="Are you sure you want to delete this post?"
            onConfirm={confirmDelete}
            onClose={() => {
              setShowModal(false);
              setDeleteId(null);
            }}
            confirmBtnText="Delete"
          />
        )}
      </div>
    </>
  );
};

export default ExplorePosts;
