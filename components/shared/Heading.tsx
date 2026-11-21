import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"h3"> {
  text: string;
}

const Heading = ({ text, className, ...props }: Props) => {
  return (
    <h3
      {...props}
      className={cn(
        "text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl",
        "text-center font-semibold text-gray-900",
        "leading-tight tracking-tight",
        className,
      )}
    >
      {text}
    </h3>
  );
};

export default Heading;
