import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Tag, Layers, Calendar, HardDrive, Maximize2 } from 'lucide-react';
import { getWallpaperBySlug, getAllWallpapers, getRelatedWallpapers, getWallpaperUrl, getWallpaperFullUrl } from '@/lib/wallpapers';
import DownloadActions from '@/components/DownloadActions';

interface Props {
  params: {
    slug: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// 1. Static pre-rendering for top bot crawl speed (RSC)
export async function generateStaticParams() {
  const wallpapers = getAllWallpapers();
  return wallpapers.map((w) => ({
    slug: w.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wallpaper = getWallpaperBySlug(params.slug);

  if (!wallpaper) {
    return {
      title: 'Không tìm thấy hình nền | Game Wallpapers 4K',
      description: 'Hình nền bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
    };
  }

  const imageUrl = getWallpaperFullUrl(wallpaper.fileName, baseUrl);
  const canonicalUrl = `${baseUrl}/wallpaper/${wallpaper.slug}`;

  return {
    title: `${wallpaper.title} (${wallpaper.resolution})`,
    description: wallpaper.description,
    keywords: [...wallpaper.tags, 'hình nền 4k', 'desktop background', wallpaper.game],
    
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${wallpaper.title} - Tải Miễn Phí 4K UHD`,
      description: wallpaper.description,
      url: canonicalUrl,
      siteName: 'Game Wallpapers 4K',
      images: [
        {
          url: imageUrl,
          width: wallpaper.width,
          height: wallpaper.height,
          alt: `${wallpaper.title} 4K UHD Preview`,
        },
      ],
      locale: 'vi_VN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${wallpaper.title} 4K UHD`,
      description: wallpaper.description,
      images: [imageUrl],
      creator: '@gamewallpapers',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}

// Page Server Component
export default function WallpaperDetailPage({ params }: Props) {
  const wallpaper = getWallpaperBySlug(params.slug);

  if (!wallpaper) {
    notFound();
  }

  const related = getRelatedWallpapers(wallpaper.slug, 3);
  const imageUrl = getWallpaperFullUrl(wallpaper.fileName, baseUrl);
  const canonicalUrl = `${baseUrl}/wallpaper/${wallpaper.slug}`;

  // Trụ cột 6: Dữ liệu cấu trúc Schema.org JSON-LD (ImageObject & BreadcrumbList)
  const imageObjectSchema = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: wallpaper.title,
    caption: wallpaper.description,
    description: wallpaper.description,
    contentUrl: imageUrl,
    thumbnailUrl: imageUrl,
    width: `${wallpaper.width} px`,
    height: `${wallpaper.height} px`,
    encodingFormat: wallpaper.format === 'PNG' ? 'image/png' : 'image/jpeg',
    copyrightHolder: {
      '@type': 'Organization',
      name: wallpaper.game,
    },
    acquireLicensePage: canonicalUrl,
    keywords: wallpaper.tags.join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Trang Chủ',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: wallpaper.category.toUpperCase(),
        item: `${baseUrl}/category/${wallpaper.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: wallpaper.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="detail-container">
      {/* JSON-LD Script injection (Trụ cột 6) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowLeft size={14} />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight size={14} />
          <Link href={`/category/${wallpaper.category}`} style={{ textTransform: 'capitalize' }}>
            {wallpaper.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{wallpaper.game}</span>
        </nav>

        {/* Detail Layout */}
        <div className="detail-layout">
          {/* Main Visual Section */}
          <section>
            <div className="detail-preview-box glass">
              <Image
                src={getWallpaperUrl(wallpaper.fileName)}
                alt={`${wallpaper.title} - ${wallpaper.game} hình nền 4k ultra hd full resolution`}
                width={wallpaper.width}
                height={wallpaper.height}
                className="detail-img"
                priority
                sizes="(max-width: 1200px) 100vw, 850px"
              />
            </div>

            {/* Description & Content for SEO Rich Indexing */}
            <article style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span className="badge badge-purple">{wallpaper.game}</span>
                <span className="badge badge-cyan">{wallpaper.resolution} UHD</span>
                <span className="badge badge-emerald">Bản quyền chính thức</span>
              </div>

              {/* Single H1 per page for strict SEO compliance */}
              <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.25 }}>
                {wallpaper.title}
              </h1>

              <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {wallpaper.description}
              </p>

            </article>
          </section>

          {/* Sidebar Specifications & Actions */}
          <aside className="detail-sidebar">
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
                Tải Xuống & Thông Số
              </h2>

              {/* Download client component */}
              <DownloadActions wallpaper={wallpaper} />

              <div style={{ marginTop: '1.5rem' }}>
                <table className="meta-spec-table">
                  <tbody>
                    <tr>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Maximize2 size={14} /> Độ phân giải</span></td>
                      <td>{wallpaper.resolution} (4K)</td>
                    </tr>
                    <tr>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><HardDrive size={14} /> Kích thước tệp</span></td>
                      <td>{wallpaper.fileSize}</td>
                    </tr>
                    <tr>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Layers size={14} /> Định dạng ảnh</span></td>
                      <td>{wallpaper.format}</td>
                    </tr>
                    <tr>
                      <td><span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> Năm phát hành</span></td>
                      <td>{wallpaper.releaseYear}</td>
                    </tr>
                    <tr>
                      <td>Tỉ lệ khung hình</td>
                      <td>16:9 Widescreen</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tags Cloud for Long-Tail SEO */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Tag size={16} color="#38bdf8" />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Từ Khóa Liên Quan</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {wallpaper.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.6rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '0.35rem',
                      color: '#94a3b8',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Related Wallpapers Internal Linking Section */}
        {related.length > 0 && (
          <section style={{ marginTop: '3rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Hình Nền Cùng Thể Loại & Tác Phẩm
            </h2>
            <div className="wallpaper-grid">
              {related.map((item) => (
                <article key={item.id} className="wallpaper-card glass">
                  <Link href={`/wallpaper/${item.slug}`} className="card-image-wrap">
                    <Image
                      src={getWallpaperUrl(item.fileName)}
                      alt={`${item.title} liên quan`}
                      width={480}
                      height={270}
                      className="card-img"
                      loading="lazy"
                    />
                  </Link>
                  <div className="card-content">
                    <span className="card-game">{item.game}</span>
                    <h3 className="card-title">
                      <Link href={`/wallpaper/${item.slug}`} style={{ color: 'inherit' }}>
                        {item.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
