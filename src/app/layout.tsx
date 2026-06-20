import type { Metadata } from "next";
import { Archivo, Space_Grotesk } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bayu Erich — Backend Engineer",
  description: "Portfolio and CV of Bayu Erich, Backend Engineer focused on APIs, databases, cloud deployment, and automation.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["Bayu Erich", "bayue48", "portfolio", "nextjs", "typescript", "backend engineer", "go", "nodejs", "databases"],
  authors: [{ name: "Bayu Erich", url: "https://github.com/bayue48" }],
  openGraph: {
    title: "Bayu Erich — Backend Engineer",
    description: "Portfolio and CV of Bayu Erich, Backend Engineer focused on APIs, databases, cloud deployment, and automation.",
    url: "https://bayue.netlify.app",
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
      className={`${archivo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0f172a] text-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
