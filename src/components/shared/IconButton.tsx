interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  color?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

const IconButton = ({
  icon,
  color = "primary",
  size = "sm",
  ...props
}: Props) => {
  return (
    <button
      className={`rounded-full p-2 flex items-center justify-items-center ${mapColorToClass(
        color
      )} ${mapSizeToClass(size)}`}
      {...props}
    >
      {icon}
    </button>
  );
};

const mapColorToClass = (color: Props["color"]) => {
  switch (color) {
    case "primary":
      return "bg-green-500 hover:bg-green-600 text-white";
    case "secondary":
      return "bg-gray-500 hover:bg-gray-600 text-white";
    default:
      return "";
  }
};

const mapSizeToClass = (size: Props["size"]) => {
  switch (size) {
    case "sm":
      return "w-8 h-8";
    case "md":
      return "w-10 h-10";
    case "lg":
      return "w-12 h-12";
    default:
      return "";
  }
};

export default IconButton;
