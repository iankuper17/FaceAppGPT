import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FaceScore AI",
  description: "Discover how the world really sees your face.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
