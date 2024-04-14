import React from "react";
import "./CartItem.css";

export interface CartItemProps {
  id: number;
  desc: string;
  img: string;
  price: string;
  userId: number;
}
const CartItem = () => {
  return (
    <div className="cartItem">
      <div className="item-pic">
        <img
          src="public/ape.png"
          style={{ width: "87px", height: "87px", borderRadius: "12px" }}
        />
      </div>
      <div className="item-desc">Ape</div>
      <div className="item-price">0.5555 ETH</div>
    </div>
  );
};

export default CartItem;
