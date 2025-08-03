import { useState } from "react";
import Button from "./Button";
import ConfirmationToast from "./ConfirmationToast";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { currencyFormatter } from "../utilities/formatting";
import { Minus, Plus } from "lucide-react";

export default function Product({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const increase = () => setQuantity((prev) => prev + 1);
  const decrease = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      <li className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <article className="h-full flex flex-col">
          <div className="aspect-w-16 aspect-h-12 bg-gray-100">
            <img
              src={product.image_url}
              alt={product.title}
              className="w-full h-48 object-cover"
            />
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {product.title}
              </h3>

              <p className="text-2xl font-bold text-indigo-600 mb-4">
                {currencyFormatter.format(product.sellingPrice)}
              </p>
            </div>

            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={decrease}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors duration-200 focus:ring-2 focus:ring-gray-500"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-xl font-semibold text-gray-900 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={increase}
                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition-colors duration-200 focus:ring-2 focus:ring-gray-500"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <Button
                    onClick={() => {
                      addToCart(product.id, quantity);
                      setShowToast(true);
                    }}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </article>
      </li>
      {showToast && (
        <ConfirmationToast
          message={`${product.title} added to cart!`}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
}
