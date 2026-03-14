import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urban Intelligence Dashboard — Pune Infrastructure Analytics",
  description: "Analyze infrastructure density, identify underserved areas, and get AI-driven recommendations for city planning in Pune.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
