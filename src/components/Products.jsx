import { useEffect, useState, useCallback } from "react";
import Product from "./Product";
import { Link } from "react-router-dom";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategoriesAndProducts = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoryRes = await fetch(
        "http://localhost:5454/api/products/categories",
        { signal }
      );

      if (!categoryRes.ok) {
        throw new Error(`Failed to fetch categories: ${categoryRes.status}`);
      }

      const categoryData = await categoryRes.json();
      const categoryList = categoryData.data || [];

      if (signal.aborted) return;
      setCategories(categoryList);

      if (categoryList.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch products for each category
      const productFetches = categoryList.map(async (category) => {
        const productRes = await fetch(
          `http://localhost:5454/api/products?categoryId=${category.id}&page=0`,
          { signal }
        );

        if (!productRes.ok) {
          console.error(
            `Failed to fetch products for category ${category.name}: ${productRes.status}`
          );
          return { categoryId: category.id, products: [] };
        }

        const productData = await productRes.json();
        return {
          categoryId: category.id,
          products: productData.data?.content || [],
        };
      });

      const results = await Promise.all(productFetches);

      if (signal.aborted) return;

      const productMap = {};
      results.forEach(({ categoryId, products }) => {
        productMap[categoryId] = products;
      });

      setProductsByCategory(productMap);
    } catch (error) {
      if (error.name === "AbortError") return;
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    fetchCategoriesAndProducts(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, [fetchCategoriesAndProducts]);

  const handleRetry = () => {
    const abortController = new AbortController();
    fetchCategoriesAndProducts(abortController.signal);
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-gray-200 rounded-lg h-64 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          ))}
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
            Failed to load products
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

  // Empty state
  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">
            No Categories Found
          </h2>
          <p className="text-gray-600">
            There are currently no product categories available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
      {categories.map((category) => {
        const categoryProducts = productsByCategory[category.id] || [];

        return (
          <div key={category.id}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {category.name}
              </h2>
              <Link
                to={`/category/${category.id}`}
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 group"
              >
                <span>See All</span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {categoryProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No products available in this category
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryProducts.map((product) => (
                  <Product key={product.id} product={product} />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
