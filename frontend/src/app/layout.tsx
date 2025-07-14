import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "StudyAI - Smart Note Taking & Study Assistant",
  description: "A multi-agent note-taking app with AI-powered study tools",
  keywords: "notes, flashcards, study, AI, learning, education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
