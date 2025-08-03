export default function Button({
  children,
  textOnly,
  className = "",
  ...props
}) {
  const baseClasses =
    "px-4 py-2 font-medium transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none";

  const cssClasses = textOnly
    ? `${baseClasses} text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg focus:ring-indigo-500 ${className}`
    : `${baseClasses} bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shadow-sm focus:ring-indigo-500 ${className}`;

  return (
    <button className={cssClasses} {...props}>
      {children}
    </button>
  );
}
