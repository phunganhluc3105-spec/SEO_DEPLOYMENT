export interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  game: string;
  category: 'action' | 'rpg' | 'anime' | 'scifi' | 'indie' | 'fantasy' | 'retro';
  tags: string[];
  description: string;
  fileName: string;
  resolution: string;
  width: number;
  height: number;
  fileSize: string;
  format: 'PNG' | 'JPG';
  releaseYear: number;
  featured?: boolean;
}
