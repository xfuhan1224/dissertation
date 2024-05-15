import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CollectedItem.css";
import { Link } from "react-router-dom";

interface CollectedItemProps {
  collectedId: number;
  collectedName: string;
  collectedImg: string;
  collectedPrice: string;
}

const CollectedItem: React.FC = () => {
  const [collectedItems, setCollectedItems] = useState<CollectedItemProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectedItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8081/backend/purchases/get",
          {
            withCredentials: true,
          }
        );
        setCollectedItems(response.data);
      } catch (error) {
        console.error("Error fetching collected items:", error);
        setError("Failed to load collected items");
      }
      setIsLoading(false);
    };

    fetchCollectedItems();
  }, []);

  return (
    <div className="collected-content">
      <h2 style={{ display: "flex", justifyContent: "center", fontSize: "" }}>
        Item you purchased
      </h2>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {collectedItems.map((item) => (
        <div className="collectedItem" key={item.collectedId}>
          <Link
            to={`/collections/${item.collectedId}`}
            className="collected-link"
            style={{ textDecoration: "none" }}
          >
            <div className="collectedItem-pic">
              <img
                src={`http://localhost:8081/${item.collectedImg}`}
                alt={item.collectedName}
                style={{ width: "87px", height: "87px", borderRadius: "12px" }}
              />
            </div>
            <div className="collected-desc">{item.collectedName}</div>
            <div className="collected-price">
              <span>{item.collectedPrice}&nbsp;</span>
              <span>ETH</span>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CollectedItem;
