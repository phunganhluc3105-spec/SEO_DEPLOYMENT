import Link from 'next/link';
import { Gamepad2, FileText } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="glass-header">
      <div className="container header-content">
        <Link href="/" className="logo-link">
          <div className="logo-icon">
            <Gamepad2 size={22} />
          </div>
          <span>
            Game<span className="gradient-text">Wallpapers</span>
          </span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="nav-links">
            <li>
              <Link href="/" className="nav-link">
                Khám phá
              </Link>
            </li>
            <li>
              <Link href="/category/rpg" className="nav-link">
                RPG & Souls
              </Link>
            </li>
            <li>
              <Link href="/category/anime" className="nav-link">
                Anime
              </Link>
            </li>
            <li>
              <Link href="/category/indie" className="nav-link">
                Indie
              </Link>
            </li>
            <li>
              <Link href="/sitemap.xml" target="_blank" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <FileText size={14} />
                <span>Sitemap</span>
              </Link>
            </li>
          </ul>
        </nav>

      </div>
    </header>
  );
}
