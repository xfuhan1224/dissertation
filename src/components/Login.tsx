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
            setCurrentUser(res.data); // 使用从后端接收到的用户数据更新 currentUser
            navigate("/");
          } else {
            alert("No record existed");
          }
        })
        .catch((err) => {
          console.error("Login failed", err);
          // 根据err.response.data可以获取后端返回的具体错误信息
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
        <h2>Sign in</h2>
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
          <button type="submit" className="btn-success">
            Log in
          </button>

          <div className="signupguide">
            <p>Click the button if you don't have an account</p>
          </div>
          <Link to="/signup" className="btn-create">
            <div className="create-word">Create Account</div>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
