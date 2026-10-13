import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Monitor, DownloadCloud, Eye } from 'lucide-react';
import { getAllWallpapers, getWallpaperUrl } from '@/lib/wallpapers';
import CategoryNav from '@/components/CategoryNav';

export default function HomePage() {
  const wallpapers = getAllWallpapers();

  const faqData = [
    {
      question: 'Làm thế nào để tải hình nền game 4K chất lượng cao miễn phí?',
      answer: 'Bạn chỉ cần chọn hình nền yêu thích, truy cập trang chi tiết và nhấn nút "Tải Miễn Phí (3840x2160)" để nhận tệp ảnh gốc chuẩn độ phân giải cao.',
    },
    {
      question: 'Các hình nền trên website có hỗ trợ màn hình 2K, 4K và UltraWide không?',
      answer: 'Tất cả hình nền đều có độ phân giải tối thiểu 1920x1080 (Full HD) và phần lớn là 3840x2160 (4K UHD), hiển thị sắc nét trên cả màn hình 16:9 lẫn tỉ lệ siêu rộng 21:9.',
    },
    {
      question: 'Website áp dụng những kỹ thuật SEO nào theo Next.js App Router?',
      answer: 'Dự án áp dụng đầy đủ 6 trụ cột: Server Components, Static & Dynamic Metadata, robots.ts, sitemap.ts, Canonical URL chống duplicate content, và Schema.org JSON-LD (WebSite, FAQPage, ImageObject).',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <main>
      {/* FAQ Schema for SERP Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div style={{ marginBottom: '1rem' }}>
            <span className="badge badge-cyan">
              <Sparkles size={12} />
              <span>Next.js App Router SEO Demo</span>
            </span>
          </div>

          <h1 className="hero-title">
            Thư Viện Hình Nền Game & Anime{' '}
            <span className="gradient-text">4K Ultra HD</span>
          </h1>

          <p className="hero-subtitle">
            Khám phá hơn 100+ hình nền nghệ thuật sắc nét từ các tựa game huyền thoại và anime đỉnh cao: Elden Ring, Cyberpunk 2077, Sekiro, Arcane, Hades, Dark Souls. Tối ưu hóa tải trang cực nhanh và chuẩn SEO Google.
          </p>

          <CategoryNav activeCategory="all" />
        </div>
      </section>

      {/* Wallpaper Gallery Grid */}
      <section className="container" aria-label="Bộ sưu tập hình nền">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Tất Cả Hình Nền Nổi Bật</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Hiển thị {wallpapers.length} tác phẩm chất lượng cao chuẩn desktop
            </p>
          </div>
          <span className="badge badge-purple">
            <Monitor size={12} />
            <span>3840 x 2160 UHD</span>
          </span>
        </div>

        <div className="wallpaper-grid">
          {wallpapers.map((item, index) => (
            <article key={item.id} className="wallpaper-card glass">
              <Link href={`/wallpaper/${item.slug}`} className="card-image-wrap" title={`Xem chi tiết ${item.title}`}>
                <div className="card-overlay-badge">
                  <span className="badge badge-cyan" style={{ background: 'rgba(10, 12, 16, 0.85)' }}>
                    {item.format} • {item.resolution}
                  </span>
                </div>
                <Image
                  src={getWallpaperUrl(item.fileName)}
                  alt={`${item.title} - ${item.game} 4K desktop background`}
                  width={640}
                  height={360}
                  className="card-img"
                  loading={index < 4 ? 'eager' : 'lazy'}
                  priority={index < 4}
                />
              </Link>

              <div className="card-content">
                <span className="card-game">{item.game}</span>
                <h3 className="card-title">
                  <Link href={`/wallpaper/${item.slug}`} style={{ color: 'inherit' }}>
                    {item.title}
                  </Link>
                </h3>

                <div className="card-meta">
                  <span>Dung lượng: {item.fileSize}</span>
                  <Link
                    href={`/wallpaper/${item.slug}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      color: '#38bdf8',
                      fontWeight: 600,
                    }}
                  >
                    <Eye size={14} />
                    <span>Xem & Tải</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span className="badge badge-emerald">FAQ Schema Rich Snippet</span>
          </div>
          <h2 className="faq-title">Câu Hỏi Thường Gặp (SEO FAQ Schema)</h2>
          <div className="faq-grid">
            {faqData.map((faq, idx) => (
              <div key={idx} className="faq-card glass">
                <h3 className="faq-question">{faq.question}</h3>
                <p className="faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
