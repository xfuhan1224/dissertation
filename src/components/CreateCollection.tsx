import "./CreateCollection.css";
import ApiSharpIcon from "@mui/icons-material/ApiSharp";
import EastSharpIcon from "@mui/icons-material/EastSharp";
import AcUnitSharpIcon from "@mui/icons-material/AcUnitSharp";
import { Link, useNavigate, NavLink } from "react-router-dom";

const CreateCollection = () => {
  return (
    <div className="create-page">
      <div className="left-page">
        <div className="left-topic">
          <ApiSharpIcon style={{ fontSize: 45, marginRight: "20px" }} />{" "}
          <h2>Create</h2>
        </div>
        <NavLink to="/drop" style={{ textDecoration: "none" }}>
          <div className="create-part">
            <button className="collectionCreate-btn">
              <div className="collectionCreate-btn-left">
                <h1 style={{ marginBottom: "20px", marginTop: "20px" }}>
                  <AcUnitSharpIcon
                    style={{
                      fontSize: 20,
                      marginRight: "10px",
                      marginTop: "-3px",
                    }}
                  />
                  Drop a collection
                </h1>
                <span
                  style={{
                    marginLeft: "30px",
                  }}
                >
                  Launch your NFT collection.
                </span>
              </div>
              <div className="collectionCreate-btn-right">
                <EastSharpIcon
                  style={{ justifyContent: "flex-end", marginTop: "2.6rem" }}
                />
              </div>
            </button>
          </div>
        </NavLink>
      </div>
      <div className="right-page">
        <img className="img3" src="/ape.png" alt="ape" />
      </div>
    </div>
  );
};

export default CreateCollection;
