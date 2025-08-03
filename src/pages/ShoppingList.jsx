import { useState } from "react";
import { Upload, Image, FileText, Search, X, CheckCircle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom";

export default function ShoppingListPage() {
  const [file, setFile] = useState(null);
  const [lines, setLines] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { token } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      setFile(dropped);
      const url = URL.createObjectURL(dropped);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5454/api/ocr/handwriting", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to process image");

      const data = await res.json();
      setLines(data.lines || []);
      setShowModal(true);
    } catch (err) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };

  const handleSearch = async () => {
    if (lines.length === 0) return;

    setSearching(true);

    const params = new URLSearchParams();
    lines.forEach((line) => {
      const keyword = line.trim().toLowerCase();
      if (keyword) params.append("keywords", keyword);
    });

    try {
      const res = await fetch(
        `http://localhost:5454/api/products/search/multi?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Search failed");
      await fetchCart();
      navigate("/carts");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Smart Shopping List
        </h1>
        <p className="text-gray-600">
          Upload your handwritten list and we'll extract the items for you
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20 w-full max-w-lg space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            dragOver
              ? "border-blue-400 bg-blue-50/50"
              : file
              ? "border-green-400 bg-green-50/50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={loading}
          />

          {previewUrl ? (
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
                <button
                  onClick={clearFile}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{file.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-gray-100 rounded-full">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 mb-1">
                  Drop your image here
                </p>
                <p className="text-sm text-gray-500">
                  or click to browse files
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                <Image className="w-4 h-4" />
                <span>Supports JPG, PNG, HEIC</span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Image...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Extract Shopping List</span>
            </div>
          )}
        </button>

        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">
            💡 Tips for best results:
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure good lighting and clear handwriting</li>
            <li>• Keep the image focused and unblurred</li>
            <li>• Write items in a list format</li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl relative animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Items Extracted!
                  </h2>
                  <p className="text-sm text-gray-500">
                    {lines.length} items found
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto mb-6">
              <div className="space-y-2">
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                disabled={searching}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>{searching ? "Searching..." : "Find in Stores"}</span>
                </div>
              </button>
              <button
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
