// src/components/ui/Input.jsx
export const Input = ({ label, id, type = "text", placeholder, value, onChange, error, required = false }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && (
      <label htmlFor={id} className="text-sm font-bold text-[#696868]">
        {label}
      </label>
    )}
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#201F24] transition-all
        ${error ? 'border-red-500' : 'border-[#98908B] focus:border-[#201F24]'}`}
    />
    {error && <span className="text-xs text-red-500">{error}</span>}
  </div>
);
