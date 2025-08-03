import { useState } from "react";
import { CreditCard, MapPin, Lock, Calendar } from "lucide-react";
import Button from "./Button";
import AddressModal from "./AddressModal";

export default function CheckoutModal({ onClose, onConfirm, token }) {
  const [showAddressModal, setShowAddressModal] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryError, setExpiryError] = useState("");

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.slice(0, 4);
      value = value.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    }
    setExpiry(value);
    validateExpiry(value);
  };

  const validateExpiry = (value) => {
    const [monthStr, yearStr] = value.split("/");
    if (
      !monthStr ||
      !yearStr ||
      monthStr.length !== 2 ||
      yearStr.length !== 2
    ) {
      setExpiryError("Invalid format");
      return;
    }

    const month = parseInt(monthStr, 10);
    const year = parseInt("20" + yearStr, 10);

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      setExpiryError("Invalid date");
      return;
    }

    const now = new Date();
    const expiryDate = new Date(year, month - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (expiryDate < currentMonth) {
      setExpiryError("Card expired");
    } else {
      setExpiryError("");
    }
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  const handleAddressConfirm = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handleFinalConfirm = () => {
    if (selectedAddress && cardNumber && expiry && cvv) {
      onConfirm(selectedAddress, cvv, expiry, cardNumber);
      onClose();
    }
  };

  const isFormValid =
    selectedAddress &&
    cardNumber.length >= 15 &&
    expiry.length === 5 &&
    cvv.length >= 3 &&
    !expiryError;

  return (
    <>
      {showAddressModal && (
        <AddressModal
          isOpen={true}
          onClose={() => setShowAddressModal(false)}
          onConfirm={handleAddressConfirm}
          token={token}
        />
      )}

      {!showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Secure Checkout
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4" />
                  <h3 className="font-semibold">Shipping Address</h3>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="font-medium text-gray-900">
                    {selectedAddress.street}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    {selectedAddress.city}, {selectedAddress.state}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {selectedAddress.country} - {selectedAddress.postalCode}
                  </p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 hover:underline transition-colors"
                  >
                    Change Address
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-4 h-4" />
                  <h3 className="font-semibold">Payment Information</h3>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pl-12"
                      inputMode="numeric"
                      maxLength={19}
                    />
                    <CreditCard className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      CVV
                    </label>
                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      maxLength={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className={`w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:border-blue-500 transition-colors pl-10 ${
                          expiryError
                            ? "border-red-300 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }`}
                        autoComplete="off"
                        inputMode="numeric"
                        maxLength={5}
                      />
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    {expiryError && (
                      <p className="text-xs text-red-600 mt-1">{expiryError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Your payment information is encrypted and secure
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center gap-3">
                <Button
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg"
                  textOnly
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFinalConfirm}
                  disabled={!isFormValid}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-lg focus:ring-blue-500 disabled:from-gray-400 disabled:to-gray-400"
                >
                  Complete Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
