// src/components/ui/Card.jsx
export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl p-6 shadow-sm ${className}`}>
    {children}
  </div>
);