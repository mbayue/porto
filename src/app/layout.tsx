import type { Metadata, Viewport } from "next";
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://bayue.my.id"
  ),
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
    description: "Backend engineer in Tuban, Indonesia. 9 API endpoints. 7 shipped projects. Live GitHub data. Query it with curl.",
    url: "https://bayue.my.id",
    siteName: "bayue.my.id",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Bayu Erich — Backend Engineer API Console",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bayu Erich — Backend Engineer | API Console",
    description: "Backend engineer in Tuban, Indonesia. 9 API endpoints. 7 shipped projects. Live GitHub data. Query it with curl.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
