import type { Metadata } from "next";
import { IM_Fell_English, IM_Fell_English_SC } from "next/font/google";
import "./globals.css";

const body = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-body",
});

const display = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Kasaysayan",
  description: "Philippine history, island by island: an illustrated, sourced timeline on an old map of the islands.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
