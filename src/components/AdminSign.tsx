import "./AdminSign.css";

function AdminSign() {
  return (
    <div className="lgn-page">
      <div className="lgn-frame">
        <h2>Admin Sign up</h2>
        <form>
          <div className="name-p">
            <label htmlFor="name">First Name</label>
            <input
              type="text"
              placeholder="Enter Your First Name"
              name="name"
            />
          </div>
          <div className="email-p">
            <label htmlFor="email">Email</label>
            <input type="email" placeholder="Enter Email" name="email" />
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminSign;
