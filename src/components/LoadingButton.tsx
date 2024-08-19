import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "./ui/button";
import { Loader2Icon } from "lucide-react";
interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}
const LoadingButton = ({
  loading,
  disabled,
  className,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      disabled={disabled || loading}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2Icon className="size-5 animate-spin" />}
      {props.children}
    </Button>
  );
};

export default LoadingButton;
