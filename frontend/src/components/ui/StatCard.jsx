export default function StatCard({ label, value, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div className={`flex-1 p-6 rounded-xl shadow-sm ${
      isDark ? "bg-[#201F24] text-white" : "bg-white text-[#201F24]"
    }`}>
      <p className={`text-sm mb-3 ${isDark ? "text-gray-300" : "text-gray-500"}`}>
        {label}
      </p>
      <p className="text-3xl font-bold">
        ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}