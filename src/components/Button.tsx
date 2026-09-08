import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2.5 font-heading font-semibold rounded-full transition-all duration-300 btn-press focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 whitespace-nowrap";

  const variants = {
    primary:
      "bg-orange text-white hover:bg-orange-light hover:shadow-lg hover:shadow-orange/20 hover:-translate-y-0.5 focus-visible:outline-orange",
    secondary:
      "border border-navy/15 text-navy hover:bg-navy hover:text-white hover:-translate-y-0.5 focus-visible:outline-navy",
    ghost: "text-navy/60 hover:text-navy hover:bg-navy/5 focus-visible:outline-navy",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-7 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
