import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getWallpaperFullUrl } from '@/lib/wallpapers';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const viewport: Viewport = {
  themeColor: '#0a0c10',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Game Wallpapers 4K - Tải Hình Nền Game & Anime Đẹp Nhất',
    template: '%s | Game Wallpapers 4K',
  },
  description: 'Thư viện hình nền máy tính 4K, Ultra HD miễn phí cho game thủ và fan anime: Elden Ring, Cyberpunk 2077, Sekiro, Arcane, Hades, Dark Souls. Tối ưu hóa chuẩn SEO.',
  keywords: [
    'hình nền game 4k',
    'game wallpaper',
    'anime wallpaper hd',
    'elden ring wallpaper',
    'cyberpunk 2077 wallpaper',
    'hình nền máy tính đẹp',
    'desktop wallpapers 4k',
    'sekiro wallpaper'
  ],
  authors: [{ name: 'GameWallpapers Dev Team', url: siteUrl }],
  creator: 'GameWallpapers',
  publisher: 'GameWallpapers Inc',
  applicationName: 'GameWallpapers 4K',
  category: 'Gaming & Technology',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Game Wallpapers 4K - Tải Hình Nền Game & Anime Đẹp Nhất',
    description: 'Khám phá bộ sưu tập hình nền game 4K sắc nét tuyệt đẹp từ các siêu phẩm Elden Ring, Cyberpunk, Sekiro, Arcane.',
    url: siteUrl,
    siteName: 'Game Wallpapers 4K',
    images: [
      {
        url: getWallpaperFullUrl('eldenring.png', siteUrl),
        width: 1200,
        height: 630,
        alt: 'Game Wallpapers 4K Banner Preview',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Game Wallpapers 4K - Tải Hình Nền Game & Anime Đẹp Nhất',
    description: 'Thư viện hình nền game 4K, anime chất lượng cao miễn phí tải về.',
    images: [getWallpaperFullUrl('eldenring.png', siteUrl)],
    creator: '@gamewallpapers',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Schema.org WebSite & Organization structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Game Wallpapers 4K',
    url: siteUrl,
    description: 'Thư viện hình nền game và anime 4K Ultra HD đỉnh cao.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Game Wallpapers 4K',
    url: siteUrl,
    logo: getWallpaperFullUrl('eldenring.png', siteUrl),
    sameAs: ['https://twitter.com/gamewallpapers'],
  };

  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
