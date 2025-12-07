import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "sonar - AI Search",
    template: "%s | sonar",
  },
  description:
    "sonar — fast, concise AI-powered search. Ask anything and get reliable answers backed by sources and reasoning.",
  keywords: ["ai search", "search engine", "ai research", "sonar", "ai assistant"],
  authors: [{ name: "sonar" }],
  openGraph: {
    title: "sonar — AI Search",
    description:
      "sonar — fast, concise AI-powered search. Ask anything and get reliable answers backed by sources and reasoning.",
    type: "website",
    url: "https://example.com",
    siteName: "sonar",
    images: [
      {
        url: "/sonar.svg",
        width: 1200,
        height: 630,
        alt: "sonar logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "sonar — AI Search",
    description:
      "sonar — fast, concise AI-powered search. Ask anything and get reliable answers backed by sources and reasoning.",
    images: ["/sonar.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://example.com",
  },
  icons: {
    icon: "/sonar-black.svg",
    apple: "/sonar-black.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/sonar-black.svg" />
        <link rel="apple-touch-icon" href="/sonar-black.svg" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "sonar",
              url: "https://example.com",
              description:
                "sonar — fast, concise AI-powered search. Ask anything and get reliable answers backed by sources and reasoning.",
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
