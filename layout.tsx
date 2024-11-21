import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'
import ThemeSwitch from "./components/theme-toggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI News Tools"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-black dark:text-white`}>
        <Providers>
          <nav className="flex w-full justify-end p-4 py-2">
            <ThemeSwitch />
          </nav>
          <main className="flex flex-col w-5/6 mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
