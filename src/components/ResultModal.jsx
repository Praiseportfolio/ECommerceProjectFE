import { CheckCircle, XCircle, X } from "lucide-react";

export default function ResultModal({
  isSuccess,
  paymentResult,
  setPaymentResult,
}) {
  if (!paymentResult) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div
          className={`px-6 py-4 ${
            isSuccess
              ? "bg-gradient-to-r from-blue-500 to-blue-600"
              : "bg-gradient-to-r from-red-500 to-red-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                {isSuccess ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                {isSuccess ? "Payment Successful" : "Payment Failed"}
              </h2>
            </div>
            <button
              onClick={() => setPaymentResult(null)}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div
            className={`text-center py-4 ${
              isSuccess ? "text-blue-800" : "text-red-800"
            }`}
          >
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isSuccess ? "bg-blue-100" : "bg-red-100"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-blue-600" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600" />
              )}
            </div>

            <p className="text-lg font-medium mb-2">{paymentResult}</p>

            {isSuccess ? (
              <p className="text-gray-600 text-sm">
                Your order has been processed successfully. You will receive a
                confirmation email shortly.
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Please check your payment details and try again. If the problem
                persists, contact support.
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-center">
            <button
              onClick={() => setPaymentResult(null)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isSuccess
                  ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                  : "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
              }`}
            >
              {isSuccess ? "Continue" : "Try Again"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
