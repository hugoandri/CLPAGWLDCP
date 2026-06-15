import type { Metadata } from "next";
import { Poppins, Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoJsonLd from "@/components/SeoJsonLd";
import CookieBanner from "@/components/CookieBanner";
import { siteConfig } from "@/lib/site";

const brand = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-brand",
  display: "swap",
});

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "DataGoal Lab — El Mundial 2026 en datos",
    template: "%s · DataGoal Lab",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Mundial 2026",
    "partidos Mundial 2026",
    "tabla Mundial 2026",
    "predicciones Mundial 2026",
    "calculadora Mundial 2026",
    "selecciones Mundial 2026",
    "estadísticas fútbol",
  ],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
      siteName: siteConfig.name,
      title: "DataGoal Lab — El Mundial 2026 en datos",
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DataGoal Lab — Mundial 2026 en datos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DataGoal Lab — El Mundial 2026 en datos",
    description: siteConfig.description,
    creator: siteConfig.twitter,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "sports",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "es",
  publisher: {
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [`https://twitter.com/${siteConfig.twitter.replace("@", "")}`],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${brand.variable} ${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes de pintar para evitar parpadeo. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        {/* Google AdSense — debe estar en <head> para que el bot de verificación lo encuentre */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen font-sans">
        <SeoJsonLd data={[websiteJsonLd, organizationJsonLd]} />
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-pitch focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <Header />
        <main id="contenido">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
