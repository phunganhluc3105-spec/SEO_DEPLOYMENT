import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eye, Monitor } from 'lucide-react';
import { getWallpapersByCategory, CATEGORIES, getWallpaperUrl } from '@/lib/wallpapers';
import CategoryNav from '@/components/CategoryNav';

interface Props {
  params: {
    cat: string;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  return CATEGORIES.filter((c) => c.slug).map((c) => ({
    cat: c.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const currentCat = CATEGORIES.find((c) => c.slug === params.cat);

  if (!currentCat) {
    return {
      title: 'Thể loại không tồn tại | Game Wallpapers 4K',
    };
  }

  const canonicalUrl = `${baseUrl}/category/${params.cat}`;

  return {
    title: `Hình Nền ${currentCat.name} 4K UHD Đẹp Nhất`,
    description: `Bộ sưu tập hình nền ${currentCat.name} độ phân giải 4K, Ultra HD tải miễn phí cho PC và màn hình gaming. Tối ưu chuẩn SEO.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Hình Nền ${currentCat.name} 4K UHD`,
      description: `Khám phá các hình nền chất lượng cao nhất thể loại ${currentCat.name}.`,
      url: canonicalUrl,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const currentCat = CATEGORIES.find((c) => c.slug === params.cat);

  if (!currentCat) {
    notFound();
  }

  const wallpapers = getWallpapersByCategory(params.cat);

  return (
    <main>
      <section className="hero-section" style={{ padding: '3rem 0 1.5rem' }}>
        <div className="container">
          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge badge-purple">Chuyên mục Thể loại</span>
          </div>

          <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>
            Hình Nền <span className="gradient-text">{currentCat.name}</span> 4K
          </h1>

          <p className="hero-subtitle">
            Tuyển chọn các tác phẩm nghệ thuật đỉnh cao thuộc thể loại {currentCat.name}. Sắc nét, chuẩn tỉ lệ 16:9 và miễn phí tải về.
          </p>

          <CategoryNav activeCategory={params.cat} />
        </div>
      </section>

      <section className="container" style={{ paddingBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Kết quả cho {currentCat.name} ({wallpapers.length} hình nền)
            </h2>
          </div>
          <span className="badge badge-cyan">
            <Monitor size={12} />
            <span>4K Desktop Ready</span>
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
                  alt={`${item.title} - ${item.game} 4k desktop wallpaper`}
                  width={640}
                  height={360}
                  className="card-img"
                  loading={index < 4 ? 'eager' : 'lazy'}
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
    </main>
  );
}
