import { cn } from "@/src/lib/utils";
import { ReactNode } from "react";

const Title = ({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) => {
  d;
  return <h1 className={cn("title-margin", className)}>{children}</h1>;
};

export default Title;
