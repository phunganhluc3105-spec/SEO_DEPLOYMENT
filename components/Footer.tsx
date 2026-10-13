import Link from 'next/link';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo-link" style={{ marginBottom: '1rem' }}>
              <div className="logo-icon">
                <Gamepad2 size={20} />
              </div>
              <span>
                Game<span className="gradient-text">Wallpapers</span>
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
              Thư viện hình nền game và anime chất lượng cao 4K / Ultra HD. Dự án mẫu tối ưu hóa chuẩn SEO theo Next.js App Router và chuẩn kiểm thử Google Lighthouse.
            </p>
          </div>

          <div className="footer-col">
            <h4>Thể loại Phổ biến</h4>
            <ul>
              <li><Link href="/category/rpg">RPG & Souls-like</Link></li>
              <li><Link href="/category/action">Action & Adventure</Link></li>
              <li><Link href="/category/anime">Anime & Manga</Link></li>
              <li><Link href="/category/indie">Indie Gems</Link></li>
              <li><Link href="/category/scifi">Sci-Fi & Cyberpunk</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Tài nguyên SEO Bot</h4>
            <ul>
              <li><a href="/robots.txt" target="_blank" rel="noopener noreferrer">robots.txt (Cấu hình Bot)</a></li>
              <li><a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">sitemap.xml (Sơ đồ trang)</a></li>
              <li><Link href="/#faq">Hỏi đáp Schema FAQ</Link></li>
              <li><a href="https://schema.org" target="_blank" rel="nofollow noopener noreferrer">Schema.org Specs</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Tiêu chuẩn SEO Áp dụng</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Next.js Server Components</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Dynamic Meta & OpenGraph</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>JSON-LD ImageObject Schema</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>Canonical Links & Alt Text</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} GameWallpapers SEO Demo. Được xây dựng phục vụ thuyết trình chuyên đề SEO.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Next.js App Router 14 <Heart size={14} color="#ef4444" fill="#ef4444" /> Lighthouse 100/100
          </p>
        </div>
      </div>
    </footer>
  );
}
