import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CartItem.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

interface CartItemProps {
  cartId: number;
  collectionId: number;
  collectionName: string;
  collectionImg: string;
  collectionPrice: string;
  onDelete: (id: number) => void;
}

const CartItem: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          "http://localhost:8081/backend/carts/get",
          {
            withCredentials: true,
          }
        );
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setError("Failed to load cart items");
      }
      setIsLoading(false);
    };

    fetchCartItems();
  }, []);

  const deleteCartItem = async (cartItemId: number) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/backend/carts/${cartItemId}`,
        {
          withCredentials: true,
        }
      );
      alert("Item has been deleted successfully!");
      setCartItems(cartItems.filter((item) => item.cartId !== cartItemId));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.status === 403
            ? "You do not have permission to delete this item."
            : error.response?.data.message || "Failed to delete the item.";
        alert(errorMessage);
      } else {
        alert("An unexpected error occurred.");
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="cart-content">
      {cartItems.map((item) => (
        <div className="cartItem" key={item.cartId}>
          <Link
            to={`/collections/${item.collectionId}`}
            className="item-link"
            style={{ textDecoration: "none" }}
          >
            <div className="item-pic">
              <img
                src={`http://localhost:8081/${item.collectionImg}`}
                alt={item.collectionName}
                style={{ width: "87px", height: "87px", borderRadius: "12px" }}
              />
            </div>
            <div className="item-desc">{item.collectionName}</div>
            <div className="item-price">
              <span>{item.collectionPrice}&nbsp;</span>
              <span>ETH</span>
            </div>
          </Link>
          <DeleteIcon
            onClick={() => deleteCartItem(item.cartId)}
            style={{ cursor: "pointer", marginLeft: "10px", marginTop: "38px" }}
          />
        </div>
      ))}
    </div>
  );
};

export default CartItem;
