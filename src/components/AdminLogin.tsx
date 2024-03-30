import "./AdminLogin.css";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  return (
    <div className="lgn-page">
      <div className="lgn-frame">
        <h2> Admin Sign in</h2>
        <form>
          <div className="email-p">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              //   onChange={handleInput}
            />
          </div>
          <div className="password-p">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
            />
          </div>
          <button type="submit" className="btn-success">
            Log in
          </button>

          <div className="signupguide">
            <p>
              Click the button if you don't have an <br></br>Admin account
            </p>
          </div>
          <Link to="/adminsign" className="btn-create">
            <div className="create-word">Create Account</div>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
