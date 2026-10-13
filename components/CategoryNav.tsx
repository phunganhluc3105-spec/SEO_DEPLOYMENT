import Link from 'next/link';
import { CATEGORIES } from '@/lib/wallpapers';

interface Props {
  activeCategory?: string;
}

export default function CategoryNav({ activeCategory = 'all' }: Props) {
  return (
    <nav className="category-bar" aria-label="Wallpaper categories">
      {CATEGORIES.map((cat) => {
        const isActive = (cat.id === 'all' && activeCategory === 'all') || cat.id === activeCategory;
        const href = cat.id === 'all' ? '/' : `/category/${cat.id}`;

        return (
          <Link
            key={cat.id}
            href={href}
            className={`category-chip ${isActive ? 'active' : ''}`}
            title={`Khám phá hình nền thể loại ${cat.name}`}
          >
            {cat.name}
          </Link>
        );
      })}
    </nav>
  );
}
