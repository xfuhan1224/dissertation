import "./AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";
import Validation from "./LgnValidation";
import React, { useState, useContext } from "react";
import axios from "axios";
import { AdminContext } from "./adminContext";

interface IErrors {
  email?: string;
  password?: string;
}

function AdminLogin() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<IErrors>({});
  const { setCurrentAdmin } = useContext(AdminContext);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);
    if (!validationErrors.email && !validationErrors.password) {
      axios
        .post("http://localhost:8081/backend/admins/adminLogin", values, {
          withCredentials: true,
        })

        .then((res) => {
          if (res.data && res.data.id) {
            setCurrentAdmin(res.data);
            navigate("/");
          } else {
            alert("No record existed");
          }
        })
        .catch((err) => {
          console.error("Login failed", err);
          if (err.response && err.response.data) {
            alert(err.response.data);
          } else {
            alert("Login failed due to unexpected error");
          }
        });
    }
  };
  return (
    <div className="lgn-page">
      <div className="lgn-frame">
        <h2> Admin Sign in</h2>
        <form onSubmit={handleSubmit}>
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
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn-admin-success">
            Log in
          </button>

          {/* <div className="signupguide">
            <p>Don't have an account yet?</p>
            <Link to="/adminsign" className="btn-create">
              <div className="create-word">Admin sign</div>
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
