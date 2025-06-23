import React, { useEffect, useState } from "react";
import { OrderList } from "primereact/orderlist";
import Footer from "./Footer";
import Header from "./Header";
import CustomBreadCrumb from "../../../util/BreadCrumb";
import { Button } from "primereact/button";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const storedCart = localStorage.getItem("product"); // ← اسم localStorage الصحيح
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        const validCart = parsedCart.filter(
          (item) => item && typeof item === "object"
        );
        setCartItems(validCart);
      } catch (err) {
        console.error("Failed to parse cart:", err);
      }
    }
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cartItems]);

  const calculateTotal = () => {
    const total = cartItems.reduce(
      (acc, item) => acc + Number(item.price || 0),
      0
    );
    setTotalPrice(total);
  };

  const handleRemove = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("product", JSON.stringify(updatedCart));
  };

  const itemTemplate = (item) => {
    return (
      <div className="flex flex-wrap p-2 align-items-center gap-3 w-full justify-content-between">
        <img
          className="w-4rem shadow-2 flex-shrink-0 border-round"
          src={
            Array.isArray(item.image) && item.image.length > 0
              ? `http://localhost:4000/uploads/${item.image[0]}`
              : "http://localhost:4000/uploads/category.webp"
          }
          alt={item.title}
        />

        <div className="flex-1 flex flex-column gap-2 xl:mr-8">
          <span className="font-bold">{item.title}</span>
          <div className="flex align-items-center gap-2">
            <i className="pi pi-tag text-sm"></i>
            <span>{item.category}</span>
          </div>
        </div>
        <div className="flex flex-column align-items-end gap-2">
          <span className="font-bold text-900">${item.price}</span>
          <Button
            icon="pi pi-trash"
            severity="danger"
            size="small"
            label="Remove"
            onClick={() => handleRemove(item._id)}
          />
        </div>
      </div>
    );
  };

  return (
    <div>
      <Header />
      <CustomBreadCrumb />
      <div className="card p-4">
        <h2>Your Cart</h2>

        <OrderList
          dataKey="_id"
          value={cartItems}
          onChange={(e) => setCartItems(e.value)}
          itemTemplate={(item) => itemTemplate(item)} 
          header="Cart Products"
          filter
          filterBy="title"
        />

        <div className="mt-4 p-3 border-top-1 surface-border">
          <div className="flex justify-content-between align-items-center mb-3">
            <span className="text-xl font-bold">Total: </span>
            <span className="text-xl text-primary font-bold">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-column sm:flex-row gap-2">
            <Button
              label="Apply"
              icon="pi pi-check"
              severity="info"
              onClick={calculateTotal}
              className="w-full sm:w-auto"
            />
            <Button
              label="Go to Checkout"
              icon="pi pi-credit-card"
              severity="success"
              className="w-full sm:w-auto"
              onClick={() => console.log("Navigating to checkout...")}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
