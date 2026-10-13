import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: 'asvnnwjd',
  api_key: '485628886819243',
  api_secret: '3Cxp4xv40tPte17Bt-I607HXeK0',
});

const MAP_FILE = path.resolve('lib/cloudinary-map.json');
const WALLPAPERS_DIR = path.resolve('public/wallpapers');

async function main() {
  if (!fs.existsSync(WALLPAPERS_DIR)) {
    console.error('Directory not found:', WALLPAPERS_DIR);
    process.exit(1);
  }

  let map = {};
  if (fs.existsSync(MAP_FILE)) {
    try {
      map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf-8'));
    } catch {
      map = {};
    }
  }

  const allFiles = fs.readdirSync(WALLPAPERS_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp';
  });

  console.log(`Found ${allFiles.length} images in ${WALLPAPERS_DIR}`);
  const toUpload = allFiles.filter(f => !map[f]);
  console.log(`Already uploaded: ${Object.keys(map).length}, Need to upload: ${toUpload.length}`);

  let uploadedCount = 0;
  const CONCURRENCY = 3;

  for (let i = 0; i < toUpload.length; i += CONCURRENCY) {
    const batch = toUpload.slice(i, i + CONCURRENCY);
    await Promise.all(
      batch.map(async (fileName) => {
        const filePath = path.join(WALLPAPERS_DIR, fileName);
        try {
          console.log(`[Uploading ${i + 1}/${toUpload.length}] ${fileName}...`);
          const res = await cloudinary.uploader.upload(filePath, {
            folder: 'wallpapers',
            use_filename: true,
            unique_filename: false,
            overwrite: true,
            resource_type: 'image',
          });
          map[fileName] = res.secure_url;
          uploadedCount++;
          console.log(`✓ Uploaded ${fileName} -> ${res.secure_url}`);
        } catch (err) {
          console.error(`✗ Error uploading ${fileName}:`, err?.message || err);
        }
      })
    );

    // Save map progress incrementally
    fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2), 'utf-8');
  }

  console.log(`\nAll done! Successfully uploaded ${uploadedCount} new files. Total in map: ${Object.keys(map).length}`);
}

main().catch(console.error);
