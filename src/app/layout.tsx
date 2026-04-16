import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppContextProvider } from "../context/AppContextProvider";
import { Toaster } from "react-hot-toast";


const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});


const geistInter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// 2. Viewport configuration (Separated from metadata in modern Next.js)
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
};

// 3. Metadata configuration replacing all your <meta> tags
export const metadata: Metadata = {
  title: "Dolà - Pay Bills, Airtime & Data in Nigeria | Find Joy. No Stress",
  description: "The simplest way to pay for airtime, data, and electricity in Nigeria. Experience joy and zero stress with Dolà's fast and secure platform.",
  keywords: "pay bills nigeria, buy airtime, buy data bundle, electricity payment, fintech nigeria, dola app, kitaodola, mobile payments",
  authors: [{ name: "Dolà" }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://kitaodola.com/",
  },
  openGraph: {
    siteName: "Dolà",
    title: "Dolà - Pay Bills. Find Joy. No Stress",
    description: "Your unconventional path to effortless bill payments. Pay for airtime, data, electricity and more.",
    type: "website",
    url: "https://kitaodola.com/",
    images: [
      {
        url: "https://kitaodola.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dolà App Dashboard",
      },
    ],
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dolaapp",
    title: "Dolà - Pay Bills. Find Joy. No Stress",
    description: "Your unconventional path to effortless bill payments in Nigeria.",
    images: ["https://kitaodola.com/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" }
    ],
  },
  other: {
    "geo.region": "NG",
    "geo.placename": "Nigeria",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schemas for Rich SEO
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dolà",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "NGN"
    },
    "description": "Dolà is a Nigerian fintech platform that simplifies bill payments, airtime, and data purchases.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1024"
    },
    "author": {
      "@type": "Organization",
      "name": "Dolà Fintech",
      "url": "https://kitaodola.com"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://kitaodola.com",
    "logo": "https://kitaodola.com/logo.svg",
    "sameAs": [
      "https://twitter.com/kitaodola",
      "https://instagram.com/kitaodola"
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics Setup */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5YXNTGHXHK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5YXNTGHXHK');
          `}
        </Script>

        {/* JSON-LD Schema Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      {/* Updated className to use Poppins */}
      <body className={`${montserrat.className} ${geistInter.variable} antialiased bg-colorbg`}>
        <AppContextProvider>
          {children}
          <Toaster />
        </AppContextProvider>
      </body>
    </html>
  );
}