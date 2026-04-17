import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Civix-Pulse | Agentic Governance & Grievance Resolution Swarm",
  description: "AI agents autonomously detect, prioritize, and resolve civic issues in real time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} min-h-screen`}>
      <body className="min-h-screen flex flex-col font-sans tracking-tight bg-white text-black">
        {children}
      </body>
    </html>
  );
}
