import clsx from "clsx";
import { HTMLAttributes } from "react";

export const Container = ({
  children,
  max,
  as = "div",
  ...props
}: {
  children: React.ReactNode;
  as?: "div" | "section" | "footer" | "header";
  max?: "sm" | "lg" | "xl";
} & HTMLAttributes<HTMLDivElement>) => {
  const Tag = as;

  return (
    <Tag
      {...props}
      className={clsx("w-container", max && `max--${max}`, props.className)}
    >
      {children}
    </Tag>
  );
};
