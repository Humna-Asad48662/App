import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Summaries App"
};

interface SummaryLayoutProps {
  children: ReactNode;
}

export default function HeadlineLayout({ children }: SummaryLayoutProps) {
  return (
      <div>
        {children}
      </div>
  );
}
