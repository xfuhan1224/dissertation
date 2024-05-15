import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { makeRequest } from "../axios";
import "./CollectionDetail.css";
import { CollectionProps } from "./Collection";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import axios, { AxiosError } from "axios";

const CollectionDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["drops", id],
    queryFn: () => makeRequest.get(`/drops/${id}`).then((res) => res.data),
  });
  const [isPurchased, setIsPurchased] = useState(false);
  useEffect(() => {
    if (data && data.isPurchased) {
      setIsPurchased(true);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  const handleAddToCart = async () => {
    try {
      await makeRequest.post(
        "http://localhost:8081/backend/carts/add",
        { collectionId: id },
        {
          withCredentials: true,
        }
      );
      alert("Item added to cart successfully!");
    } catch (error) {
      console.error("Failed to add to cart", error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 409) {
          alert("This item is already in your cart.");
        } else {
          alert("Failed to add to cart, you account has been revoked.");
        }
      }
    }
  };

  const handlePurchase = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/backend/purchases/buy",
        { CollectionId: id },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("Purchase successful!");
      } else {
        alert("Purchase failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error during purchase:", error);
      alert("Purchase failed, your account has been revoked.");
    }
  };

  return (
    <div className="detail-page">
      {data && (
        <div className="detail-container">
          <div className="detail-left">
            <div className="image-container">
              <img
                src={`http://localhost:8081/${data.img}`}
                alt="Collection"
                style={{ width: "600px", height: "600px" }}
              />
            </div>
          </div>
          <div className="detail-right">
            <div className="detail-name">
              <h5>Collection Name</h5>
              <p>{data.desc}</p>
            </div>

            <div className="detail-purchase">
              <div className="detail-purchase-frame">
                <h5>Current price</h5>
                <p>{data.price} ETH</p>
                <div className="detail-seller">
                  <div className="listed-by">Listed by&nbsp;</div>
                  <div className="creator-name">{data.creatorName}</div>
                </div>
                <div className="btn-purchase">
                  {isPurchased ? (
                    <button disabled className="btnPurchase">
                      Purchased
                    </button>
                  ) : (
                    <button className="btnPurchase" onClick={handlePurchase}>
                      Buy 1 now
                    </button>
                  )}
                  <button className="add-to-cart" onClick={handleAddToCart}>
                    <FavoriteBorderOutlinedIcon></FavoriteBorderOutlinedIcon>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDetail;
