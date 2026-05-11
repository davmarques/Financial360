// src/components/ui/Button.jsx
export const Button = ({ children, onClick, type = "button", variant = "primary", className = "", disabled = false }) => {
  const baseStyles = "w-full py-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm";
  
  const variants = {
    primary: "bg-[#201F24] text-white hover:bg-[#4D4B54]",
    secondary: "bg-[#F8F4F0] text-[#201F24] hover:bg-white hover:border-[#201F24] border border-transparent",
    tertiary: "text-[#696868] hover:text-[#201F24] underline decoration-solid",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
