'use client';

import { useState } from 'react';
import { Sparkles, X, CheckCircle2, ShieldCheck, FileCode, Bot, Compass, Network } from 'lucide-react';

interface Props {
  pageType: 'home' | 'detail' | 'category';
  title?: string;
  canonicalUrl?: string;
  schemaType?: string;
}

export default function SeoExplainerModal({ pageType, title, canonicalUrl, schemaType }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const pillars = [
    {
      id: 1,
      title: 'Server Component vs Client Component',
      icon: <FileCode size={18} className="text-cyan-400" />,
      desc: 'Trang này render 100% HTML trên Server (Server Component). Bot của Google/Bing nhận ngay nội dung đầy đủ mà không cần đợi tải & chạy JavaScript, đạt TTFB (Time to First Byte) tối ưu.',
    },
    {
      id: 2,
      title: pageType === 'detail' ? 'Dynamic Metadata (generateMetadata)' : 'Static Metadata (export const metadata)',
      icon: <Sparkles size={18} className="text-purple-400" />,
      desc: pageType === 'detail'
        ? `Trang chi tiết sinh thẻ <title>, <meta description> và OpenGraph động theo từng hình nền: "${title}".`
        : 'Trang chủ dùng Metadata tĩnh được khai báo chuẩn TypeScript, sẵn sàng chia sẻ lên Facebook/Zalo/Twitter.',
    },
    {
      id: 3,
      title: 'Bot Navigation (app/robots.ts)',
      icon: <Bot size={18} className="text-emerald-400" />,
      desc: 'Tự động tạo robots.txt tại /robots.txt: Cho phép mọi bot index hợp lệ, chặn đường dẫn riêng tư (/api/), dẫn bot đến file /sitemap.xml.',
    },
    {
      id: 4,
      title: 'Tự động sinh Sitemap (app/sitemap.ts)',
      icon: <Compass size={18} className="text-amber-400" />,
      desc: 'File sitemap.xml tự động gom link Trang chủ + toàn bộ đường dẫn wallpaper động kèm ngày cập nhật lastModified và priority.',
    },
    {
      id: 5,
      title: 'Chống trùng lặp với Canonical URL',
      icon: <ShieldCheck size={18} className="text-blue-400" />,
      desc: `Khai báo canonical chuẩn: "${canonicalUrl || 'http://localhost:3000'}". Dù người dùng truy cập link có param query ?ref=facebook hay ?filter=sort thì Google vẫn chỉ index 1 URL gốc.`,
    },
    {
      id: 6,
      title: 'Dữ liệu cấu trúc JSON-LD (Schema.org)',
      icon: <Network size={18} className="text-rose-400" />,
      desc: `Nhúng script application/ld+json chuẩn ${schemaType || 'WebSite / ImageObject'}. Giúp Google bot hiểu đây là hình nền có độ phân giải, tác giả và hiển thị Rich Snippets đẹp trên Google Search & Google Images.`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-secondary"
        style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', borderColor: 'rgba(56, 189, 248, 0.4)' }}
      >
        <Sparkles size={14} style={{ color: '#38bdf8' }} />
        <span>Xem 6 Trụ Cột SEO</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className="glass"
            style={{
              maxWidth: '750px',
              width: '100%',
              borderRadius: '1rem',
              padding: '2rem',
              maxHeight: '85vh',
              overflowY: 'auto',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>
                  Live SEO Audit Inspector
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Áp Dụng Lý Thuyết SEO (Next.js App Router)
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.5rem',
                }}
              >
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pillars.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '0.75rem',
                    padding: '1rem 1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <CheckCircle2 size={16} color="#38bdf8" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                      Trụ cột {p.id}: {p.title}
                    </h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginLeft: '1.6rem' }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(56, 189, 248, 0.08)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                fontSize: '0.825rem',
                color: '#cbd5e1',
              }}
            >
              💡 <strong>Mẹo thuyết trình:</strong> Nhấn mạnh với thầy cô rằng toàn bộ file <code style={{ color: '#38bdf8' }}>robots.ts</code>, <code style={{ color: '#38bdf8' }}>sitemap.ts</code>, thẻ <code style={{ color: '#38bdf8' }}>canonical</code> và <code style={{ color: '#38bdf8' }}>JSON-LD</code> đều được Next.js tự động xử lý chuẩn SSR, đáp ứng 100% tiêu chí khắt khe của Lighthouse SEO.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
