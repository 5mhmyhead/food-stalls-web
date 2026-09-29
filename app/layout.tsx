import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Stalls App",
  description: "A finals project for Enterprise Programming",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}