import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Headline App"
};

interface HeadlineLayoutProps {
  children: ReactNode;
}

export default function HeadlineLayout({ children }: HeadlineLayoutProps) {
  return (
      <div>
        {children}
      </div>
  );
}