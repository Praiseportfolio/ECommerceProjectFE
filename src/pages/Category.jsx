import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import Product from "../components/Product";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState({ content: [], totalPages: 0 });
  const [categoryName, setCategoryName] = useState("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);

  const fetchCategoryName = useCallback(
    async (signal) => {
      try {
        const res = await fetch(
          "http://localhost:5454/api/products/categories",
          { signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const data = await res.json();
        const category = data.data?.find((cat) => cat.id === parseInt(id));

        if (signal.aborted) return;

        if (!category) {
          throw new Error("Category not found");
        }

        setCategoryName(category.name);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching category name:", error);
        throw error;
      }
    },
    [id]
  );

  const fetchProducts = useCallback(
    async (signal, pageNum = page) => {
      try {
        setProductsLoading(true);

        const res = await fetch(
          `http://localhost:5454/api/products?categoryId=${id}&page=${pageNum}&size=12`,
          { signal }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();

        if (signal.aborted) return;

        setProducts(data.data || { content: [], totalPages: 0 });
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching products:", error);
        throw error;
      } finally {
        if (!signal.aborted) {
          setProductsLoading(false);
        }
      }
    },
    [id, page]
  );

  const fetchData = useCallback(
    async (signal, pageNum = 0) => {
      try {
        setLoading(true);
        setError(null);

        // Fetch category name and products concurrently
        await Promise.all([
          fetchCategoryName(signal),
          fetchProducts(signal, pageNum),
        ]);
      } catch (error) {
        if (error.name === "AbortError") return;
        setError(error.message);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [fetchCategoryName, fetchProducts]
  );

  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal, page);

    return () => {
      abortController.abort();
    };
  }, [fetchData, page]);

  const handlePrev = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page + 1 < products.totalPages) {
      setPage(page + 1);
    }
  };

  const handleRetry = () => {
    const abortController = new AbortController();
    fetchData(abortController.signal, page);
  };

  // Initial loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-64 animate-pulse"
            ></div>
          ))}
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="h-10 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <div className="text-red-600 text-lg font-medium">
            Failed to load category
          </div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Check if category exists but has no products
  const hasProducts = products.content && products.content.length > 0;
  const showPagination = products.totalPages > 1;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{categoryName}</h1>
        {hasProducts && (
          <p className="text-gray-600 mt-2">
            {products.totalPages > 1 &&
              `Page ${page + 1} of ${products.totalPages}`}
          </p>
        )}
      </div>

      {!hasProducts ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-lg">
            No products found in this category
          </div>
          <p className="text-gray-400 mt-2">
            Check back later for new products
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="relative">
            {productsLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.content.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {showPagination && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrev}
                disabled={page === 0 || productsLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>

              <div className="flex items-center space-x-2">
                <span className="text-lg font-medium text-gray-700">
                  Page {page + 1} of {products.totalPages}
                </span>
              </div>

              <button
                onClick={handleNext}
                disabled={page + 1 >= products.totalPages || productsLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Additional pagination info for large datasets */}
          {showPagination && (
            <div className="text-center mt-4 text-sm text-gray-500">
              Showing {page * 12 + 1} -{" "}
              {Math.min((page + 1) * 12, products.totalPages * 12)} products
            </div>
          )}
        </>
      )}
    </div>
  );
}
