import "./AdminSign.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Validation from "./SignValidation";

interface IErrors {
  name?: string;
  email?: string;
  password?: string;
}

function AdminSign() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState<IErrors>({});

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
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
      axios
        .post("http://localhost:8081/backend/admins/adminRegister", values)
        .then((res) => {
          console.log("Registration successful", res.data);
          navigate("/adminlogin");
        })
        .catch((err) => {
          console.error("Registration failed", err);
        });
    }
  };
  return (
    <div className="sing-page">
      <div className="sing-frame">
        <h2>Admin Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="name-i">
            <label htmlFor="name">First Name</label>
            <input
              type="name"
              placeholder="Enter Your First Name"
              name="name"
              onChange={handleInput}
            />
          </div>
          <div className="email-p">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
            />
          </div>
          <div className="password-p">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              onChange={handleInput}
            />
          </div>
          <button type="submit" className="btn-success">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSign;
