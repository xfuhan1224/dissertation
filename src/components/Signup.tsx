import React, { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./SignValidation";
import axios from "axios";

interface IErrors {
  name?: string;
  email?: string;
  password?: string;
}

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [errors, setErrors] = useState<IErrors>({});

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (
      !validationErrors.name &&
      !validationErrors.email &&
      !validationErrors.password
    ) {
      // 创建一个 FormData 对象
      const formData = new FormData(event.currentTarget);

      axios
        .post("http://localhost:8081/backend/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Registration successful", response.data);
          navigate("/login");
        })
        .catch((error) => {
          console.error("Registration failed", error);
        });
    }
  };

  return (
    <div className="sing-page">
      <div className="sing-frame">
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="profilePic-p">
            <label htmlFor="profilePic">Profile Picture</label>
            <div
              className="profilePic-upload-container"
              onClick={() => document.getElementById("profilePic")?.click()}
            >
              {profilePicPreview ? (
                <img
                  src={profilePicPreview}
                  alt="Profile preview"
                  className="profilePic-preview"
                />
              ) : (
                <div className="profilePic-placeholder">Upload Picture</div>
              )}
            </div>
            <input
              type="file"
              id="profilePic"
              name="profilePic"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>
          <div className="name-p">
            <label htmlFor="name">Username</label>
            <input
              type="name"
              placeholder="Enter Your Username"
              name="name"
              onChange={handleInput}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="email-p">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="password-p">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">Password is too short</span>
            )}
          </div>
          <button type="submit" className="btn-success">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
