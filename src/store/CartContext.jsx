import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const token =
    "eyJhbGciOiJIUzM4NCJ9.eyJpYXQiOjE3NTQxMTA3MjAsImV4cCI6MTc1NTkxMDcyMCwiZW1haWwiOiJvbHVzYW55YXByYWlzZTQ0QGdtYWlsLmNvbSJ9.24C02A-WVa-b1WYdlZxDzlM0F4I8LB3dySzlHXc_y7q2YH9pqbHK_TNjFAySZd7M"; // Ideally from AuthContext

  const fetchCart = async () => {
    const response = await fetch("http://localhost:5454/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCart(data);
  };

  const addToCart = async (productId, quantity, userEmail) => {
    await fetch(
      `http://localhost:5454/api/cart/add?productId=${productId}&quantity=${quantity}&userEmail=${userEmail}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchCart(); // Refresh cart
  };

  const removeFromCart = async (cartItemId) => {
    await fetch(`http://localhost:5454/api/cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCart();
  };

  const clearCart = async () => {
    await fetch(`http://localhost:5454/api/cart`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await fetch(
      `http://localhost:5454/api/cart/${cartItemId}?quantity=${quantity}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    fetchCart();
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
