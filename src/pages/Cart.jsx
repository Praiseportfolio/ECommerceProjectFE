import { useCart } from "../store/CartContext";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Heart,
} from "lucide-react";
import { currencyFormatter } from "../utilities/formatting";
import CheckoutModal from "../components/CheckoutModal";
import { useAuth } from "../store/AuthContext";
import ProcessingModal from "../components/ProcessingModal";
import ResultModal from "../components/ResultModal";

export default function CartPage() {
  const { token } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const navigate = useNavigate();

  const handleIncrease = ({ id, quantity }) => updateQuantity(id, quantity + 1);

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    setRemovingItems((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      removeFromCart(item.id);
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }, 300);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.product.sellingPrice * item.quantity,
    0
  );

  const totalItems = cart.length;
  const estimatedTax = subtotal * 0.0; //
  const estimatedTotal = subtotal + estimatedTax;

  const handleCheckout = async (selectedAddress, cvv, expiry, cardNumber) => {
    setProcessing(true);

    try {
      const checkoutRes = await fetch(
        `http://localhost:5454/api/orders/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...selectedAddress }),
        }
      );

      if (!checkoutRes.ok) throw new Error("Checkout failed");
      const orderData = await checkoutRes.json();

      const paymentRes = await fetch(`http://localhost:5454/api/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cvv,
          expiry,
          cardNumber,
        }),
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        setPaymentResult(paymentData.error || "Payment failed");
        throw new Error("Payment failed");
      } else {
        setPaymentResult(paymentData.message || "Payment successful!");
        setPaymentSuccess(true);
        clearCart();
        setShowCheckout(false);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during checkout or payment.");
      setPaymentResult("Payment failed");
    } finally {
      setProcessing(false);
    }
  };

  const EmptyCart = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        Your cart is empty
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Looks like you haven't added any items to your cart yet. Start shopping
        to fill it up!
      </p>
      <Button
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Continue Shopping
      </Button>
    </div>
  );

  const CartItem = ({ item }) => (
    <li
      className={`transition-all duration-300 ease-in-out ${
        removingItems.has(item.id)
          ? "opacity-50 scale-95 transform"
          : "opacity-100 scale-100"
      }`}
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <img
              src={item.product.image_url}
              alt={item.product.title}
              loading="lazy"
              className="w-24 h-24 object-cover rounded-lg shadow-sm"
            />
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {item.product.title}
              </h3>
              <button
                onClick={() => handleRemove(item)}
                className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Remove from cart"
                disabled={removingItems.has(item.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <p className="text-2xl font-bold text-gray-900 mb-4">
              {currencyFormatter.format(item.product.sellingPrice)}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => handleDecrease(item)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white transition-all duration-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-500">Subtotal</p>
                <p className="text-lg font-bold text-gray-900">
                  {currencyFormatter.format(
                    item.product.sellingPrice * item.quantity
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  const OrderSummary = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Items ({totalItems})</span>
          <span>{currencyFormatter.format(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Estimated Tax</span>
          <span>{currencyFormatter.format(estimatedTax)}</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <span>{currencyFormatter.format(estimatedTotal)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => setShowCheckout(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
        >
          Proceed to Checkout
        </Button>
        <Button
          onClick={clearCart}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg transition-colors duration-200"
        >
          Clear Cart
        </Button>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Heart className="w-4 h-4" />
          <span>Free shipping on orders over $75</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ResultModal
        paymentResult={paymentResult}
        isSuccess={paymentSuccess}
        setPaymentResult={setPaymentResult}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => window.history.back()}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
            </div>
          </div>

          {cart.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <ul className="space-y-4 mb-8 lg:mb-0">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-1">
                <OrderSummary />
              </div>
            </div>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onConfirm={handleCheckout}
          token={token}
        />
      )}
      {processing && <ProcessingModal />}
    </>
  );
}
