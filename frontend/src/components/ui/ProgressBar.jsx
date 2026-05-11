export default function ProgressBar({ value, target, colorClass }) {
  const percentage = Math.min((value / target) * 100, 100);

  return (
    <div className="w-full bg-beige-100 h-2 rounded-full overflow-hidden">
      <div 
        className={`h-full rounded-full ${colorClass}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}