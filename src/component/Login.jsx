import React, { useState } from "react";
import "./Login.css";
import loginImage from "../assets/images/loginimg.jpg";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false); // top ma useState ma add karvu

  const [mobileValidation, setMobileValidation] = useState("");
  const [roleValidation, setRoleValidation] = useState("");
  const [otpValidation, setOtpValidation] = useState("");
  const navigate = useNavigate();
  const [gOtp, setGenerateOtp] = useState("");

  const handleGenerateOtp = () => {
    const random = Math.floor(1000 + Math.random() * 9000).toString();
    setOtp(random);
    setGenerateOtp(random);
    alert("One Time Password: " + random);
    setOtpValidation("");
  };

  const handleMobileChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");
    if (value.length === 10) {
      setMobileValidation("");
    }
    setMobile(value);
  };
  const selectRoleValue = (e) => {
    setRoleValidation("");
    setRole(e.target.value);
  };
  const handleOtpChange = (event) => {
    const value = event.target.value;
    setOtp(value);
    if (value === gOtp) {
      setOtpValidation("");
    }
  };

  const loginClick =async (event) => {
    event.preventDefault();

    setMobileValidation("");
    setRoleValidation("");
    setOtpValidation("");

    if (!mobile || mobile.length !== 10) {
      setMobileValidation("Mobile Number is required");
      toast.error("Please Enter Valid Mobile Number");
      return;
    }

    if (!role) {
      setRoleValidation("Role is required");
      toast.error("Please Select Role");
      return;
    }

    if (!otp) {
      setOtpValidation("OTP is required");
      toast.error("Please Enter OTP");
      return;
    }

    if (gOtp !== otp) {
      setOtpValidation("OTP is invalid");
      toast.error("Invalid OTP! Please try again.");
      return;
    }

    const formData = {
      mobile,
      role,
      otp,
    };
    // ---new try block
    try{
      const res = await fetch(
        "https://696b4aaf624d7ddccaa0b883.mockapi.io/users"
      );
      const users = await res.json();
      //find existing user
      const existingUser = users?.find(
        (user) =>
          user.mobile == mobile &&
          user.role == role
      );
      if(existingUser){
        const userExistingData = existingUser;
        toast.success("Login successfully");
        setTimeout(()=>{
          localStorage.setItem("loginData",JSON.stringify(userExistingData));
          navigate("/");
        }, 2000);
      }else{
        const url = `https://696b4aaf624d7ddccaa0b883.mockapi.io/users`;
        const method = "POST";
        const response = await fetch(url,{
            method,
            headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      console.log(response, "res");
      if(!response.ok){
        toast.error("Invalid Request");
      }
      const data = await response.json();
      console.log("Form submitted:", data);
      toast.success("Login successfully");
      setTimeout(() => {
        localStorage.setItem("loginData",JSON.stringify(data));
        navigate("/");
      },1000);
    }
    // ----------add start--------------
    // try{
    //   setLoading(true);
    //   const url = `https://696b4aaf624d7ddccaa0b883.mockapi.io/users`;
    //   const method = "POST";
    //   const response = await fetch(url,{
    //     method,
    //     headers: {
    //       "Content-type": "application/json",
    //     },
    //     body: JSON.stringify(formData),
    //   });
    //   console.log(response, "res");
    //   if(!response.ok){
    //     toast.error("Invalid Request");
    //   }
    //   const data = await response.json();
    //   console.log("Form submitted:", data);
    //   toast.success("Login successfully");
    //   setTimeout(() => {
    //     localStorage.setItem("loginData",JSON.stringify(data));
    //     navigate("/");
    //   },1000);
    }catch{
      toast.error("Error");
    }

    setMobile("");
    setRole("");
    setOtp("");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <ToastContainer />
        <img src={loginImage} className="images" alt="Login Illustration" />
      </div>

      <div className="login-right">
        <h2>Hello Again,</h2>
        <p className="subtitle">Welcome back, let's get started!</p>

        <form onSubmit={loginClick}>
          <input
            type="tel"
            minLength={10}
            maxLength={10}
            placeholder="Mobile Number"
            className="input-field"
            value={mobile}
            onChange={handleMobileChange}
          />

          {mobileValidation ? (
            <p className="error">{mobileValidation}</p>
          ) : (
            <></>
          )}

          <select
            className="input-field"
            value={role}
            onChange={selectRoleValue}
          >
            <option value="">Select a Role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {roleValidation ? <p className="error">{roleValidation}</p> : <></>}

          <button
            type="button"
            className="btn primary"
            onClick={handleGenerateOtp}
          >
            Generate OTP
          </button>
          {/* OTP Input સેક્શન */}
          <div className="input-field">
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={4}
              renderSeparator={<span style={{ margin: "0 24px" }}> </span>}
              renderInput={(props) => <input {...props} />}
              inputStyle="otp-box"
              shouldAutoFocus={true}
              
            />
            
          </div>

          {otpValidation ? <p className="error">{otpValidation}</p> : <></>}

          <button className="btn secondary">login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
