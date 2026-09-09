interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "nav" | "main";
  narrow?: boolean;
}

export default function Container({
  children,
  className = "",
  as: Tag = "div",
  narrow = false,
}: ContainerProps) {
  return (
    <Tag
      className={`mx-auto w-full px-5 sm:px-6 lg:px-10 xl:px-12 ${
        narrow ? "max-w-3xl" : "max-w-[1320px]"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
