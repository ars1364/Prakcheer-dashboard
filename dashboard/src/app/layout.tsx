import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prakcheer Dashboard",
  description: "Cloud panel dashboard — RTL/Farsi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
