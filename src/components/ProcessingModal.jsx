export default function ProcessingModal() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Processing payment…
        </h2>
        <p className="text-gray-600 text-sm">
          Please wait, this may take a moment.
        </p>
      </div>
    </div>
  );
}
