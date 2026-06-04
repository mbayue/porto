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
  title: "Bayu Erich | Web & Automation Developer",
  description: "Developer portfolio of Bayu Erich (bayue48), showing AI repository visualization, automation bots, scraping, and backend system utilities.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  keywords: ["Bayu Erich", "bayue48", "portfolio", "nextjs", "typescript", "discord bots", "scraping", "web developer", "jakarta"],
  authors: [{ name: "Bayu Erich", url: "https://github.com/bayue48" }],
  openGraph: {
    title: "Bayu Erich | Web & Automation Developer",
    description: "Developer portfolio of Bayu Erich (bayue48), showing AI repository visualization, automation bots, scraping, and backend system utilities.",
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
