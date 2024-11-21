import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Translate App"
};

interface TranslateLayoutProps {
  children: ReactNode;
}

export default function TranslateLayout({ children }: TranslateLayoutProps) {
  return (
      <div>
        {children}
      </div>
  );
}
