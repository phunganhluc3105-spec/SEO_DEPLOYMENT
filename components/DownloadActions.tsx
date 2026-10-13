'use client';

import { useState } from 'react';
import { Download, Share2, Check, ExternalLink } from 'lucide-react';
import { Wallpaper } from '@/lib/types';
import { getWallpaperUrl, getWallpaperDownloadUrl } from '@/lib/wallpapers';

interface Props {
  wallpaper: Wallpaper;
}

export default function DownloadActions({ wallpaper }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleShare = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    const downloadUrl = getWallpaperDownloadUrl(wallpaper.fileName);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = wallpaper.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.9rem 1.5rem', fontSize: '1rem' }}
        aria-label={`Tải xuống hình nền ${wallpaper.title}`}
      >
        <Download size={18} />
        <span>{downloading ? 'Đang chuẩn bị...' : `Tải Miễn Phí (${wallpaper.resolution})`}</span>
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <button
          onClick={handleShare}
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
          aria-label="Chia sẻ link hình nền"
        >
          {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
          <span>{copied ? 'Đã sao chép!' : 'Chia sẻ URL'}</span>
        </button>

        <a
          href={getWallpaperUrl(wallpaper.fileName)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem' }}
          aria-label="Mở ảnh gốc trong tab mới"
        >
          <ExternalLink size={16} />
          <span>Mở ảnh gốc</span>
        </a>
      </div>
    </div>
  );
}
