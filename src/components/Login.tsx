import React, { useState, useContext } from "react";
import "./Login.css";
import Validation from "./LgnValidation";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./authContext";

interface IErrors {
  email?: string;
  password?: string;
}

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<IErrors>({});
  const { setCurrentUser } = useContext(AuthContext);

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
        .post("http://localhost:8081/backend/auth/login", values, {
          withCredentials: true,
        })

        .then((res) => {
          if (res.data && res.data.id) {
            setCurrentUser(res.data);
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
        <h2>Welcome</h2>
        <p>Create an account or log in to access NFTinusite</p>

        <form onSubmit={handleSubmit}>
          <div className="email-p">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              placeholder="Enter your email"
              name="email"
              onChange={handleInput}
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="password-p">
            <label htmlFor="password">Your Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              name="password"
              onChange={handleInput}
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <button type="submit" className="btn-success">
            Log in
          </button>

          <div className="signupguide">
            <p>Don't have an account yet?</p>
            <Link to="/signup" className="btn-create">
              <div className="create-word">Sign up.</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
