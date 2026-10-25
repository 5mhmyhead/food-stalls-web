import { Playfair_Display, Poppins } from "next/font/google";
import type { Metadata } from "next";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${poppins.variable}`}
    >
      <body>
        <main className="relative min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
