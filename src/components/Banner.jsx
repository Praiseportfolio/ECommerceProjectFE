export default function Banner() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 pb-2">
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2 lg:w-2/5">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&crop=center"
            alt="Fresh fruits and vegetables"
            className="w-full h-64 md:h-80 object-cover rounded-lg"
          />
        </div>

        <div className="w-full md:w-1/2 lg:w-3/5">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Fresh Fruits and Vegetables
              <span className="block text-green-600 mt-2">in Stock</span>
            </h2>
            <div className="mt-6 flex items-center justify-center md:justify-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-lg text-gray-600 font-medium">
                Always fresh, always quality
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
