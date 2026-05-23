import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazirmatn = localFont({
  src: [
    { path: "./fonts/vazirmatn/Vazirmatn-Light.woff2",    weight: "300", style: "normal" },
    { path: "./fonts/vazirmatn/Vazirmatn-Regular.woff2",  weight: "400", style: "normal" },
    { path: "./fonts/vazirmatn/Vazirmatn-Medium.woff2",   weight: "500", style: "normal" },
    { path: "./fonts/vazirmatn/Vazirmatn-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/vazirmatn/Vazirmatn-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Prakcheer Dashboard",
  description: "Cloud panel dashboard — RTL/Farsi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body>{children}</body>
    </html>
  );
}
