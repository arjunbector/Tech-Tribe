interface InfiniteScrollContainerProps extends React.PropsWithChildren {
  onBottomReached: () => void;
  className?: string;
}
import { cn } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
const InfiniteScrollContainer = ({
  onBottomReached,
  children,
  className,
}: InfiniteScrollContainerProps) => {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={cn(className)}>
      {children}
      <div ref={ref}></div>
    </div>
  );
};

export default InfiniteScrollContainer;
