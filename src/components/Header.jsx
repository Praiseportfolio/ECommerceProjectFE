import { Link } from "react-router-dom";
import Button from "./Button";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";

import { ShoppingCart, LogIn, LogOut, Store, Upload } from "lucide-react";

export default function Header() {
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();

  const totalUniqueItems = cart.length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 font-['Pacifico',cursive]">
              {/* Fruits & Veggies */}
              Frueggies
            </h2>
          </div>
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/shopping-list">
                <nav>
                  <Button
                    textOnly={true}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Shopping List</span>
                  </Button>
                </nav>
              </Link>
              <Link to="/carts">
                <nav>
                  <Button
                    textOnly={true}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart ({totalUniqueItems})</span>
                  </Button>
                </nav>
              </Link>
              <nav>
                <Button
                  textOnly={true}
                  onClick={() => logout()}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </nav>
            </>
          ) : (
            <>
              <nav>
                <Link to="/registration">
                  <Button
                    textOnly={true}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Signin</span>
                  </Button>
                </Link>
              </nav>
              <nav>
                <Link to="/login">
                  <Button
                    textOnly={true}
                    className="flex items-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Button>
                </Link>
              </nav>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
