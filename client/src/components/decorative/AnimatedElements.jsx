import React from "react";

export const AnimatedButton = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const variantClasses = {
    primary:
      "bg-primary text-primary-foreground hover:shadow-lg hover:scale-105 active:scale-95",
    secondary:
      "bg-secondary text-secondary-foreground hover:shadow-lg hover:scale-105 active:scale-95",
    accent:
      "bg-accent text-accent-foreground hover:shadow-lg hover:scale-105 active:scale-95",
    outline:
      "border-2 border-primary text-primary hover:bg-primary/10 hover:scale-105 active:scale-95",
  };

  return (
    <button
      className={`
        px-6 py-2 rounded-lg font-medium
        transition-all duration-300 ease-out
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlowCard = ({ children, className = "" }) => {
  return (
    <div
      className={`
        bg-card rounded-xl border border-border p-6
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:border-primary/50 animate-pulse-glow
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default AnimatedButton;
