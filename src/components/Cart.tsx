import React, { useEffect, useState, useContext } from "react";
import "./Cart.css";
import CartItem from "./CartItem";

const Cart = () => {
  return (
    <div className="cart-container">
      <h2>Your Wishlist</h2>
      <CartItem />
    </div>
  );
};

export default Cart;
