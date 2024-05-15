import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CollectedItem.css";
import { Link, useParams } from "react-router-dom";

interface CreatedItemProps {
  createdId: number;
  createdName: string;
  createdImg: string;
  createdPrice: string;
}

const CreatedItem: React.FC = () => {
  const [collections, setCollections] = useState<CreatedItemProps[]>([]);
  const { userId } = useParams<{ userId: string }>();
  useEffect(() => {
    axios
      .get(`http://localhost:8081/collections/user/${userId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setCollections(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user collections", error);
      });
  }, []);

  if (collections.length === 0) {
    return <div>No collections found.</div>;
  }
  return (
    <div className="created-content">
      <h2 style={{ display: "flex", justifyContent: "center", fontSize: "" }}>
        Item you created
      </h2>
      {collections.map((item) => (
        <div className="createdItem" key={item.createdId}>
          <Link
            to={`/collections/${item.createdId}`}
            className="created-link"
            style={{ textDecoration: "none" }}
          >
            <div className="createdItem-pic">
              <img
                src={`http://localhost:8081/${item.createdImg}`}
                alt={item.createdName}
                style={{ width: "87px", height: "87px", borderRadius: "12px" }}
              />
            </div>
            <div className="created-desc">{item.createdName}</div>
            <div className="created-price">
              <span>{item.createdPrice}&nbsp;</span>
              <span>ETH</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CreatedItem;
