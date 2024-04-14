import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import "./CollectionDetail.css";
import AddShoppingCartSharpIcon from "@mui/icons-material/AddShoppingCartSharp";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AppsSharpIcon from "@mui/icons-material/AppsSharp";

const CollectionDetail = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["drops", id],
    queryFn: () => makeRequest.get(`/drops/${id}`).then((res) => res.data),
  });

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
      alert("Failed to add to cart");
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
                  <button className="btnPurchase">Buy 1 now</button>
                  <button className="add-to-cart" onClick={handleAddToCart}>
                    <AddShoppingCartSharpIcon></AddShoppingCartSharpIcon>
                  </button>
                  <button className="detail-like">
                    <FavoriteBorderOutlinedIcon />
                  </button>
                  <button className="detail-collect">
                    <AppsSharpIcon />
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
