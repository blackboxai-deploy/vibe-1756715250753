import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";
import { BackToTop } from "@/components/layout/back-to-top";
import { ContinueWatching } from "@/components/layout/continue-watching";
import { PlayerProvider } from "@/components/player/player-provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap"
});

export const metadata: Metadata = {
  title: "StreamFlix - Watch Movies & TV Shows",
  description: "Stream the latest movies and TV shows in HD quality. Discover trending content, create watchlists, and enjoy unlimited entertainment.",
  keywords: "movies, tv shows, streaming, entertainment, watch online, HD quality",
  authors: [{ name: "DKTechnoZone" }],
  creator: "DKTechnoZone",
  publisher: "StreamFlix",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://streamflix.app"),
  openGraph: {
    title: "StreamFlix - Watch Movies & TV Shows",
    description: "Stream the latest movies and TV shows in HD quality",
    url: "https://streamflix.app",
    siteName: "StreamFlix",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "StreamFlix - Movie & TV Streaming Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamFlix - Watch Movies & TV Shows",
    description: "Stream the latest movies and TV shows in HD quality",
    images: ["/og-image.jpg"],
    creator: "@dktechnozone",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f1316" />
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-inter antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <PlayerProvider>
            <div className="min-h-screen bg-background text-foreground">
              {/* Desktop Layout */}
              <div className="hidden lg:flex">
                <Sidebar />
                <div className="flex-1 ml-20">
                  <Header />
                  <main className="px-6 xl:px-12 pb-8">
                    <div className="page-transition">
                      {children}
                    </div>
                  </main>
                </div>
              </div>

              {/* Mobile Layout */}
              <div className="lg:hidden">
                <Header />
                <main className="px-4 pb-20">
                  <div className="page-transition">
                    {children}
                  </div>
                </main>
                <BottomNav />
              </div>

              {/* Global Components */}
              <BackToTop />
              <ContinueWatching />
              <Toaster 
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'hsl(var(--card))',
                    color: 'hsl(var(--card-foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </PlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}