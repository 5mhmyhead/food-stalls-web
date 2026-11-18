import { Playfair_Display, Poppins } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-sans",
  style: "normal",
  weight: ["400", "600", "700", "900"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  style: "italic",
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  title: "Kawaii Count",
  description: "A cutesy food stalls website application.",
};

export const viewport: Viewport = {
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${poppins.variable} overflow-x-clip`}
    >
      <body className="min-h-dvh overflow-x-clip">{children}</body>
    </html>
  );
}