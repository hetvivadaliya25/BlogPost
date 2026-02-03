import { useEffect, useState } from "react";
import "./EditProfileModal.css";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../component/Loader"; // Loader component

const EditProfileModal = ({ userId, onConfirm, onClose, confirmBtnText = "Save" }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    role: "",
    otp: "",
  });

  // Fetch user data on mount or when userId changes
  useEffect(() => {
    if (userId) fetchUserById();
  }, [userId]);

  const fetchUserById = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://696b4aaf624d7ddccaa0b883.mockapi.io/users/${userId}`
      );
      const data = await response.json();

      setFormData({
        name: data?.name || "",
        mobile: data?.mobile || "", // ✅ Use mobile here
        role: data?.role || "",
        otp: data?.otp || "",
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile") {
      const onlyNums = value.replace(/\D/g, ""); // Keep only numbers
      if (onlyNums.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: onlyNums }));
        if (onlyNums.length === 10) setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Save button click
  const handleSave = async () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile Number is required";
    } else if (formData.mobile.length !== 10) {
      newErrors.mobile = "Enter a valid 10-digit number";
      toast.error("Please Enter Valid Mobile Number");
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        mobile: formData.mobile, // ✅ Send mobile
      };

      const response = await fetch(
        `https://696b4aaf624d7ddccaa0b883.mockapi.io/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedUser = await response.json();
      toast.success("Profile Updated Successfully");

      setTimeout(() => {
        onConfirm(updatedUser);
        onClose();
      }, 1000);
    } catch (error) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className={`edit-profile-modal ${loading ? "blur-bg" : ""}`}>
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="edit-modal">
          <h2>Edit Profile</h2>

          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="input-group">
            <input
              type="text"
              placeholder="Mobile Number"
              name="mobile" // ✅ updated name
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="error-text">{errors.mobile}</span>}
          </div>

          <select name="role" value={formData.role} disabled>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <input
            type="text"
            placeholder="OTP"
            name="otp"
            value={formData.otp}
            disabled
          />

          <div className="modal-actions">
            <button className="btn btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button
              className="btn btn-save"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : confirmBtnText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfileModal;
