import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Plus,
  Edit3,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AddressModal({ isOpen, onClose, onConfirm, token }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  const resetForm = useCallback(() => {
    setFormData({
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    });
    setEditingAddress(null);
    setShowForm(false);
  }, []);

  const fetchAddresses = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://localhost:5454/api/addresses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal,
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch addresses: ${res.status}`);
        }

        const data = await res.json();

        if (signal?.aborted) return;

        setAddresses(data || []);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching addresses:", error);
        setError(error.message);
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [token]
  );

  useEffect(() => {
    if (isOpen && token) {
      const abortController = new AbortController();
      fetchAddresses(abortController.signal);

      return () => {
        abortController.abort();
      };
    }
  }, [isOpen, token, fetchAddresses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const required = ["street", "city", "state", "country", "postalCode"];
    return required.every((field) => formData[field]?.trim().length > 0);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setFormLoading(true);
      setError(null);

      const method = editingAddress ? "PUT" : "POST";
      const url = editingAddress
        ? `http://localhost:5454/api/addresses/${editingAddress.id}`
        : "http://localhost:5454/api/addresses";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to ${editingAddress ? "update" : "create"} address: ${
            res.status
          }`
        );
      }

      resetForm();
      await fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      setError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({ ...address });
    setShowForm(true);
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      setError(null);

      const res = await fetch(`http://localhost:5454/api/addresses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to delete address: ${res.status}`);
      }

      if (selectedAddressId === id) {
        setSelectedAddressId(null);
      }

      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      setError(error.message);
    }
  };

  const handleConfirm = () => {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (selectedAddress) {
      onConfirm(selectedAddress);
      onClose();
    }
  };

  const handleClose = () => {
    resetForm();
    setError(null);
    setSelectedAddressId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Manage Addresses</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
                <p className="text-gray-600">Loading addresses...</p>
              </div>
            </div>
          ) : (
            <>
              {addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No addresses found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add your first address to get started
                  </p>
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingAddress(null);
                      setError(null);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Address
                  </button>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Saved Addresses
                    </h3>
                    <button
                      onClick={() => {
                        setShowForm(true);
                        setEditingAddress(null);
                        setError(null);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add New
                    </button>
                  </div>

                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border-2 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                        selectedAddressId === address.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="relative mt-1">
                            <input
                              type="radio"
                              name="address"
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              onChange={() => setSelectedAddressId(address.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            {selectedAddressId === address.id && (
                              <Check className="w-3 h-3 text-blue-600 absolute top-0.5 left-0.5 pointer-events-none" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {address.street}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm pl-6">
                              {address.city}, {address.state}
                            </p>
                            <p className="text-gray-600 text-sm pl-6">
                              {address.country} - {address.postalCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(address);
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit address"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(address.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {showForm && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {editingAddress ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        placeholder="123 Main Street"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="San Francisco"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="CA"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="94102"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="USA"
                        className="w-full border border-gray-300 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={resetForm}
                      disabled={formLoading}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={formLoading || !validateForm()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                    >
                      {formLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {editingAddress ? "Update Address" : "Add Address"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {addresses.length > 0 && !loading && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""}{" "}
                available
              </p>
              <button
                onClick={handleConfirm}
                disabled={!selectedAddressId}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  selectedAddressId
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
