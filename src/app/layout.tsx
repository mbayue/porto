import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "./globals.css";

const firaCode = Fira_Code({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bayu Erich — Backend Engineer | API Console",
  description: "Portfolio of Bayu Erich, Backend Engineer in Indonesia. Served as an API: query endpoints for projects, experience, stack, and contact.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["Bayu Erich", "mbayue", "backend engineer", "api", "nextjs", "typescript", "go", "nodejs", "databases", "indonesia"],
  authors: [{ name: "Bayu Erich", url: "https://github.com/mbayue" }],
  openGraph: {
    title: "Bayu Erich — Backend Engineer | API Console",
    description: "Building reliable APIs and backend systems. Query endpoints for projects, experience, stack, and contact.",
    url: "https://bayue.my.id",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${firaCode.variable} ${inter.variable} bg-black text-[#ededed] antialiased`}
    >
      <body className="min-h-full bg-black">
        {children}
      </body>
    </html>
  );
}
