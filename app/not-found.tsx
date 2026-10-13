import Link from 'next/link';
import { Home, Compass, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Không Tìm Thấy Trang | Game Wallpapers 4K',
  description: 'Trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass" style={{ maxWidth: '640px', width: '100%', padding: '3rem 2rem', borderRadius: '1.25rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '1.5rem' }}>
          <ShieldAlert size={48} />
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.75rem' }} className="gradient-text">
          404
        </h1>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc' }}>
          Trang Này Không Tồn Tại
        </h2>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
          Đường dẫn bạn truy cập có thể đã bị đổi tên, xóa bỏ hoặc nhập sai địa chỉ. Hãy quay về trang chủ hoặc khám phá các thể loại hình nền phổ biến dưới đây.
        </p>

        {/* SEO Tip callout */}
        <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '0.75rem', padding: '1rem', textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
          <strong style={{ color: '#38bdf8' }}>💡 Góc nhìn SEO (Hard 404 vs Soft 404):</strong><br />
          Next.js trả về mã trạng thái HTTP chuẩn <strong>404 Not Found</strong>, báo hiệu cho Googlebot lập tức loại bỏ URL này khỏi chỉ mục (Index) và tránh lỗi <em>Soft 404</em> gây lãng phí Crawl Budget.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            <Home size={16} />
            <span>Về Trang Chủ</span>
          </Link>
          <Link href="/category/rpg" className="btn btn-secondary">
            <Compass size={16} />
            <span>Khám phá RPG</span>
          </Link>
          <Link href="/category/anime" className="btn btn-secondary">
            <Compass size={16} />
            <span>Khám phá Anime</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
