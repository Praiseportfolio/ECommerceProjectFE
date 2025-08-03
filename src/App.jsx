import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";
import Layout from "./components/Layout";
import RequireVerified from "./components/RequireVerified";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import { Suspense } from "react";
import RegistrationPage from "./pages/Registration";
import CategoryPage from "./pages/Category";
import CartPage from "./pages/Cart";
import ShoppingListPage from "./pages/ShoppingList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/registration", element: <RegistrationPage /> },
      { path: "/category/:id", element: <CategoryPage /> },
      {
        path: "/carts",
        element: (
          <RequireVerified>
            <CartPage />
          </RequireVerified>
        ),
      },
      {
        path: "/shopping-list",
        element: (
          <RequireVerified>
            <ShoppingListPage />
          </RequireVerified>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Suspense fallback={<p>Loading</p>}>
          <RouterProvider router={router} />
        </Suspense>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
