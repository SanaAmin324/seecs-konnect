export const FloatingCloud = ({ delay = 0, size = "md", position = "top" }) => {
  const sizeMap = {
    sm: "w-12 h-6",
    md: "w-20 h-10",
    lg: "w-32 h-16",
  };

  const positionMap = {
    top: "top-10",
    middle: "top-1/2",
    bottom: "bottom-10",
  };

  return (
    <div
      className={`absolute ${positionMap[position]} -right-20 pointer-events-none opacity-30 dark:opacity-20`}
      style={{ animation: `cloud-drift 8s ease-in-out infinite ${delay}s` }}
    >
      <svg
        className={`${sizeMap[size]} text-primary`}
        viewBox="0 0 200 100"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 80 C20 80 0 60 0 40 C0 25 10 15 20 10 C25 5 35 0 50 0 C65 0 75 5 80 10 C90 5 100 0 115 0 C145 0 170 20 170 50 C170 70 160 85 145 90 L50 90 Z" />
      </svg>
    </div>
  );
};

export const CloudGroup = ({ count = 3 }) => {
  return (
    <div className="relative">
      {[...Array(count)].map((_, i) => (
        <FloatingCloud
          key={i}
          delay={i * 2}
          size={i % 2 === 0 ? "md" : "sm"}
          position={["top", "middle", "bottom"][i % 3]}
        />
      ))}
    </div>
  );
};

export default FloatingCloud;
