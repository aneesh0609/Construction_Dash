export default function Header({ title }) {
  return (
    <header className="w-full bg-white shadow p-4 flex justify-between items-center sticky top-0 z-20">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">{title}</h1>
      <button className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
        Logout
      </button>
    </header>
  );
}
