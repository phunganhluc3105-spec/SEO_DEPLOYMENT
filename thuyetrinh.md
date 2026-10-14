# Thuyết trình SEO với Next.js App Router

> Phạm vi: bắt đầu từ **Slide 3**.  
> Cách trình bày mỗi trụ cột: **khái niệm dùng để làm gì → vấn đề giải quyết → code nào cần mở → kết quả cần chỉ ra**.

---

## 🟦 SLIDE 3 — Tổng quan: 6 trụ cột SEO

### Mục tiêu của phần này

SEO kỹ thuật giúp công cụ tìm kiếm:

1. Nhận được HTML và nội dung quan trọng nhanh hơn.
2. Hiểu mỗi trang nói về chủ đề gì.
3. Biết URL nào là URL chính, tránh lập chỉ mục trùng lặp.
4. Tìm được các URL hợp lệ để thu thập dữ liệu.
5. Hiểu hình ảnh, thương hiệu, FAQ và cấu trúc nội dung.

### Sáu trụ cột trong dự án

```text
① Server Component / Client Island   ④ sitemap.ts
② Dynamic Metadata                   ⑤ Canonical URL
③ robots.ts                          ⑥ Schema.org JSON-LD
```

### Câu dẫn nên nói

> “Mỗi trụ cột giải quyết một câu hỏi khác nhau của Google: trang có nội dung gì,
> có được phép crawl không, URL nào là URL chính và nội dung có cấu trúc ra sao?”

### Bản đồ file cần mở khi thuyết trình

| Trụ cột | File cần mở | Đoạn code cần highlight |
|---|---|---|
| Server Component | `app/wallpaper/[slug]/page.tsx` | `export default function...` và `<Image>` |
| Client Island | `components/DownloadActions.tsx` | `'use client'`, `useState`, `onClick` |
| Dynamic Metadata | `app/wallpaper/[slug]/page.tsx` | `generateMetadata()` |
| Robots | `app/robots.ts` | `rules` và `sitemap` |
| Sitemap | `app/sitemap.ts` | `wallpaperUrls`, `categoryUrls` |
| Canonical | `app/wallpaper/[slug]/page.tsx` | `alternates.canonical` |
| JSON-LD | `app/layout.tsx`, `app/page.tsx`, `[slug]/page.tsx` | `application/ld+json` |

---

## 🟦 SLIDE 4 — Trụ cột ①: Server Component và Client Island

### Khái niệm này dùng để làm gì?

- **Server Component** chạy phần lấy dữ liệu và render nội dung trên server.
- HTML ban đầu đã có tiêu đề, nội dung, ảnh và liên kết để trình duyệt lẫn bot
  có thể đọc ngay.
- **Client Island** là một component con chỉ được đưa sang trình duyệt khi cần
  tương tác như `useState`, `onClick` hoặc Clipboard API.
- Cách tách này giúp phần nội dung SEO vẫn ở server, còn phần tải/chia sẻ ảnh
  vẫn hoạt động ở client.

> Nói chính xác: Client Component trong Next.js vẫn có thể được prerender HTML.
> Ý chính ở đây là không biến cả trang thành vùng client nếu chỉ một khu vực cần
> tương tác; ta giữ phần nội dung và dữ liệu ở server để giảm JavaScript gửi xuống.

### CODE 1 — Trang chi tiết là Server Component

**Mở file:** `app/wallpaper/[slug]/page.tsx`  
**Highlight:** hàm trang không có `'use client'`, lệnh lấy dữ liệu và thẻ `<Image>`.

```tsx
// app/wallpaper/[slug]/page.tsx
export default function WallpaperDetailPage({ params }: Props) {
  const wallpaper = getWallpaperBySlug(params.slug);

  if (!wallpaper) {
    notFound();
  }

  return (
    <main className="detail-container">
      <Image
        src={getWallpaperUrl(wallpaper.fileName)}
        alt={`${wallpaper.title} - ${wallpaper.game} hình nền 4k ultra hd full resolution`}
        width={wallpaper.width}
        height={wallpaper.height}
      />
    </main>
  );
}
```

### CODE 2 — Chỉ khu vực có tương tác mới là Client Component

**Mở file:** `components/DownloadActions.tsx`  
**Highlight:** dòng `'use client'`, `useState` và hai thuộc tính `onClick`.

```tsx
// components/DownloadActions.tsx
'use client';

import { useState } from 'react';

export default function DownloadActions({ wallpaper }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  return (
    <>
      <button onClick={handleDownload} disabled={downloading}>
        Tải Miễn Phí ({wallpaper.resolution})
      </button>
      <button onClick={handleShare}>
        {copied ? 'Đã sao chép!' : 'Chia sẻ URL'}
      </button>
    </>
  );
}
```

### CODE 3 — Server Component gọi Client Island

**Trong file:** `app/wallpaper/[slug]/page.tsx`  
**Highlight:** dòng import và dòng render component.

```tsx
import DownloadActions from '@/components/DownloadActions';

// Ở trong JSX của trang Server Component:
<DownloadActions wallpaper={wallpaper} />
```

### Demo cần chỉ ra

1. Mở trang `/wallpaper/elden-ring-shadow-of-the-erdtree`.
2. Chuột phải → **View Page Source**.
3. `Ctrl+F` tìm tiêu đề, `alt=` hoặc `application/ld+json`.
4. Nói rõ: nội dung SEO nằm trong HTML/metadata server; nút tải và chia sẻ
   là phần cần JavaScript ở client.

### F12 — Cần mở gì và nói gì?

Điểm quan trọng: **F12 không hiện nhãn “Server Component” hay “Client
Component” trong HTML**. Dòng `'use client'` là chỉ thị lúc build và không
được giữ lại như một thẻ HTML. Vì vậy:

- Code trong VS Code chứng minh **ranh giới component**.
- F12 chứng minh **HTML ban đầu và hành vi sau khi JavaScript chạy**.

Nhấn **F12 → Elements** rồi dùng `Ctrl+F`:

```text
<h1>...
<img alt="... hình nền 4k ...">
<button> Tải Miễn Phí ... </button>
```

- Thẻ `<h1>` và `<img alt="...">` là nội dung server render cho trang.
- Các nút cũng xuất hiện trong HTML ban đầu, nhưng việc đổi trạng thái và xử lý
  click cần JavaScript của `DownloadActions.tsx`.

### F12 đang chứng minh điều gì?

#### 1. Chứng minh phần Server Component

Mở **F12 → Network → reload → chọn request loại Document → Response**. Tìm:

```text
<h1>Elden Ring: Shadow of the Erdtree 4K Wallpaper</h1>
alt="... hình nền 4k ..."
Tải Miễn Phí (3840x2160)
```

Nói:

> “Ngay ở response HTML đầu tiên đã có nội dung wallpaper, tiêu đề và nút.
> Đây là kết quả của trang Server Component được render từ server.”

F12 không cho ta thấy chữ “Server Component”; F12 cho ta thấy **kết quả mà
Server Component tạo ra**.

#### 2. Chứng minh phần Client Island

Quay lại **F12 → Elements**, chọn nút **Chia sẻ URL** hoặc **Tải Miễn Phí**,
sau đó bấm thử:

- Bấm **Chia sẻ URL**: trạng thái đổi thành `Đã sao chép!` trong khoảng 2,5
  giây.
- Bấm **Tải Miễn Phí**: trạng thái đổi thành `Đang chuẩn bị...` rồi trở lại
  bình thường.

Nói:

> “HTML của nút đã có sẵn từ đầu, nhưng hành vi click và state thay đổi là do
> JavaScript của Client Island `DownloadActions` xử lý ở trình duyệt.”

Đây là cách F12 chứng minh **hành vi client**, chứ không phải chứng minh
trực tiếp dòng `'use client'`.

Ở tab **Network**, reload trang và chọn request loại **Document**. Trong
**Response**, tìm `Tải Miễn Phí`, `<h1>` hoặc `application/ld+json`. Đây là
cách chứng minh HTML đã được gửi từ server ngay ở lần tải đầu tiên.

### Nếu muốn show đúng cây component

F12 mặc định chỉ có **Elements/Network/Console**, không có cây React. Nếu máy
đã cài React Developer Tools:

1. Chạy `npm run dev`.
2. Mở F12 → tab **Components**.
3. Tìm `WallpaperDetailPage` và `DownloadActions`.

Tab **Components** giúp nhìn cây React, nhưng khi thuyết trình không bắt buộc
phải mở tab này. Cách đơn giản và chắc chắn nhất là:

```text
page.tsx không có 'use client' → Server Component
DownloadActions.tsx có 'use client' → Client Component
F12 Document → HTML đã render
F12 click → hành vi client hoạt động
```

---

## 🟦 SLIDE 5 — Trụ cột ②: Dynamic Metadata

### Nói ngắn gọn khái niệm này là gì?

**Metadata** là thông tin mô tả trang nằm trong phần `<head>` của HTML, không
phải phần nội dung người dùng đọc trực tiếp trong `<body>`. Ví dụ: title,
description, ảnh preview khi chia sẻ và canonical URL.

**Dynamic Metadata** nghĩa là các thông tin đó được tạo **theo từng wallpaper**,
thay vì dùng một title và description giống nhau cho toàn website.

### Vấn đề cần giải quyết

Website có nhiều URL:

```text
/wallpaper/elden-ring-shadow-of-the-erdtree
/wallpaper/cyberpunk-2077-night-city-neon
```

Nếu tất cả trang đều dùng:

```text
Title: Game Wallpapers 4K
Description: Thư viện hình nền game
```

thì Google khó phân biệt nội dung từng trang, người dùng cũng không thấy tiêu
đề cụ thể khi tìm kiếm hoặc chia sẻ link.

### Câu nói khi thuyết trình

> “Mỗi wallpaper là một trang có nội dung khác nhau, nên phần `<head>` cũng
> phải khác nhau. `generateMetadata()` lấy `slug` trên URL, tìm đúng wallpaper
> rồi tự sinh title, description, ảnh Open Graph và canonical cho trang đó.”

### CODE — Metadata được tạo theo dữ liệu wallpaper

**Mở file:** `app/wallpaper/[slug]/page.tsx`  
**Highlight:** `params.slug`, `getWallpaperBySlug`, `title`, `description`,
`openGraph` và `alternates.canonical`.

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const wallpaper = getWallpaperBySlug(params.slug);

  if (!wallpaper) {
    return {
      title: 'Không tìm thấy hình nền | Game Wallpapers 4K',
      description: 'Hình nền bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.',
    };
  }

  const imageUrl = getWallpaperFullUrl(wallpaper.fileName, baseUrl);
  const canonicalUrl = `${baseUrl}/wallpaper/${wallpaper.slug}`;

  return {
    title: `${wallpaper.title} (${wallpaper.resolution})`,
    description: wallpaper.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${wallpaper.title} - Tải Miễn Phí 4K UHD`,
      description: wallpaper.description,
      images: [
        {
          url: imageUrl,
          width: wallpaper.width,
          height: wallpaper.height,
        },
      ],
    },
  };
}
```

### Giải thích từng đoạn code

```tsx
const wallpaper = getWallpaperBySlug(params.slug);
```

- `params.slug` là phần động trong URL.
- Ví dụ URL có slug `elden-ring-shadow-of-the-erdtree` thì hệ thống tìm đúng
  dữ liệu của wallpaper Elden Ring.

```tsx
title: `${wallpaper.title} (${wallpaper.resolution})`,
description: wallpaper.description,
```

- Tạo title và description riêng cho wallpaper hiện tại.
- Đây là thông tin Google có thể dùng khi hiển thị trang trong kết quả tìm kiếm.

```tsx
openGraph: {
  title: ...,
  images: [{ url: imageUrl, ... }],
},
```

- Tạo preview khi chia sẻ đường link trên Facebook, Zalo, Discord hoặc mạng xã
  hội khác.

```tsx
alternates: {
  canonical: canonicalUrl,
},
```

- Khai báo URL chính của trang, giúp xử lý các URL có query string hoặc nhiều
  đường dẫn trỏ đến cùng nội dung.

### Mạch trình bày: code → output

```text
params.slug
  → getWallpaperBySlug(params.slug)
  → wallpaper.title / wallpaper.description
  → generateMetadata()
  → HTML <head>
```

### Demo cần chỉ ra

1. Mở trang Elden Ring:

   ```text
   http://localhost:3000/wallpaper/elden-ring-shadow-of-the-erdtree
   ```

2. Nhìn title trên tab trình duyệt.
3. Mở trang Cyberpunk:

   ```text
   http://localhost:3000/wallpaper/cyberpunk-2077-night-city-neon
   ```

4. Chỉ ra title trên tab đã thay đổi. Như vậy chứng minh metadata được tạo
   theo `slug`, không phải một metadata cố định.

### F12 — Kiểm tra metadata được sinh ra

Mở **F12 → Elements → `<head>`**. Tìm lần lượt:

```html
<title>...</title>
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:image" content="...">
```

Nói theo mạch **code → output**:

```text
generateMetadata().title       → <title>...</title>
generateMetadata().description → <meta name="description" ...>
openGraph.title                → <meta property="og:title" ...>
openGraph.images               → <meta property="og:image" ...>
```

Sau đó đổi sang URL wallpaper khác và reload. Chỉ ra rằng các giá trị trong
`<head>` thay đổi theo `params.slug`, không phải một title dùng chung cho mọi
trang.

### Câu chốt dễ nhớ

> “Dynamic Metadata không làm thay đổi nội dung chính đang hiển thị trong
> trang; nó tạo thông tin mô tả phù hợp cho từng URL trong `<head>`, để Google
> hiểu trang và để link được chia sẻ có preview đúng.”

---

## 🟦 SLIDE 6 — Trụ cột ③: `robots.ts`

### Khái niệm này dùng để làm gì?

`robots.ts` tạo ra endpoint `/robots.txt`. File này đưa ra hướng dẫn crawl
cho bot:

- được phép crawl khu vực nào;
- không được crawl khu vực nào;
- sitemap nằm ở đâu.

`robots.txt` không phải cơ chế bảo mật. Dữ liệu nhạy cảm vẫn phải được bảo vệ
bằng authentication/authorization ở server.

### CODE — Luật crawl của dự án

**Mở file:** `app/robots.ts`  
**Highlight:** `userAgent`, `allow`, `disallow`, `sitemap`.

```tsx
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/'],
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

### Kết quả cần show

Mở:

```text
http://localhost:3000/robots.txt
```

Chỉ ra sự tương ứng:

```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /private/
Sitemap: http://localhost:3000/sitemap.xml
```

### F12 — Kiểm tra request đến `/robots.txt`

Với trang `/robots.txt`, nhấn **F12 → Network → reload** rồi chọn request
`robots.txt`:

1. **Headers → Request URL**: kiểm tra đúng `/robots.txt`.
2. **Headers → Status Code**: thường là `200`.
3. **Response/Preview**: thấy nội dung `User-agent`, `Allow`, `Disallow`,
   `Sitemap`.

Nói rõ: `app/robots.ts` là code nguồn; `/robots.txt` là output mà bot truy cập.
F12 đang kiểm tra request/response thật, không chỉ nhìn đoạn code trong VS Code.

---

## 🟦 SLIDE 7 — Trụ cột ④: `sitemap.ts`

### Khái niệm này dùng để làm gì?

Sitemap là danh sách URL quan trọng để công cụ tìm kiếm phát hiện và crawl
trang. Trong dự án này, sitemap tự sinh URL cho:

- trang chủ;
- từng danh mục;
- từng wallpaper.

Khi thêm wallpaper hoặc danh mục vào dữ liệu, danh sách sitemap cũng được tạo
lại từ dữ liệu đó, không cần nhập từng URL bằng tay.

### CODE — Tạo URL cho từng nhóm trang

**Mở file:** `app/sitemap.ts`  
**Highlight:** hai lệnh `.map()` và mảng `return`.

```tsx
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const wallpapers = getAllWallpapers();

  const wallpaperUrls: MetadataRoute.Sitemap = wallpapers.map((item) => ({
    url: `${baseUrl}/wallpaper/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  const categoryUrls: MetadataRoute.Sitemap = CATEGORIES
    .filter((category) => category.slug)
    .map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  return [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    ...categoryUrls,
    ...wallpaperUrls,
  ];
}
```

### Kết quả cần show

Mở:

```text
http://localhost:3000/sitemap.xml
```

Tìm thử một URL dạng `/category/...` và một URL dạng `/wallpaper/...`.
Giải thích `priority` và `changeFrequency` là tín hiệu gợi ý, không phải cam
kết Google sẽ xếp hạng hoặc crawl theo đúng giá trị đó.

### F12 — Kiểm tra request đến `/sitemap.xml`

Nhấn **F12 → Network → reload**, chọn `sitemap.xml` và mở **Response**.
Dùng `Ctrl+F` tìm:

```xml
<loc>http://localhost:3000/category/...</loc>
<loc>http://localhost:3000/wallpaper/...</loc>
```

Đối chiếu khi nói:

```text
wallpapers.map(...) → nhiều <url> của wallpaper
CATEGORIES.map(...) → nhiều <url> của danh mục
return [...]        → một sitemap.xml hoàn chỉnh
```

---

## 🟦 SLIDE 8 — Trụ cột ⑤: Canonical URL

### Khái niệm này dùng để làm gì?

Một nội dung có thể bị truy cập bằng nhiều URL:

```text
/wallpaper/elden-ring
/wallpaper/elden-ring?ref=facebook
/wallpaper/elden-ring?sort=new
```

Canonical nói cho công cụ tìm kiếm biết URL nào là phiên bản chính để gom tín
hiệu và hạn chế vấn đề nội dung trùng lặp.

### CODE — Khai báo URL chuẩn

**Mở file:** `app/wallpaper/[slug]/page.tsx`  
**Highlight:** `canonicalUrl` và `alternates.canonical`.

```tsx
const canonicalUrl = `${baseUrl}/wallpaper/${wallpaper.slug}`;

return {
  title: `${wallpaper.title} (${wallpaper.resolution})`,
  alternates: {
    canonical: canonicalUrl,
  },
};
```

Next.js dùng metadata này để sinh HTML tương đương:

```html
<link rel="canonical" href="http://localhost:3000/wallpaper/elden-ring" />
```

### Demo cần chỉ ra

Mở View Page Source và tìm `canonical`. Nhấn mạnh:

- canonical là tín hiệu định danh URL chính;
- canonical không thay thế redirect, phân quyền hoặc xử lý URL ở server;
- URL canonical phải là URL tuyệt đối, ổn định và trỏ đến trang hợp lệ.

### F12 — Tìm thẻ canonical trong `<head>`

Nhấn **F12 → Elements**, mở `<head>` và `Ctrl+F` tìm `canonical`:

```html
<link rel="canonical"
  href="http://localhost:3000/wallpaper/elden-ring-shadow-of-the-erdtree">
```

Thử truy cập thêm `?ref=demo` vào cuối URL rồi reload. Thẻ canonical vẫn
trỏ về URL chính không có query string. Đây là phần output tương ứng trực tiếp
với:

```tsx
alternates: {
  canonical: canonicalUrl,
}
```

---

## 🟦 SLIDE 9 — Trụ cột ⑥: Schema.org JSON-LD

### Khái niệm này dùng để làm gì?

HTML thông thường cho người dùng xem, còn **structured data** giúp máy hiểu
ngữ nghĩa của nội dung. JSON-LD có thể mô tả:

- website và tổ chức;
- câu hỏi thường gặp;
- ảnh, kích thước ảnh;
- breadcrumb của trang.

Structured data không đảm bảo chắc chắn có rich result, nhưng giúp Google hiểu
nội dung rõ hơn khi dữ liệu hợp lệ và phù hợp với nội dung đang hiển thị.

### CODE 1 — Mô tả wallpaper bằng `ImageObject`

**Mở file:** `app/wallpaper/[slug]/page.tsx`  
**Highlight:** `@type`, `contentUrl`, `width`, `height`, `encodingFormat`.

```tsx
const imageObjectSchema = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  name: wallpaper.title,
  description: wallpaper.description,
  contentUrl: imageUrl,
  thumbnailUrl: imageUrl,
  width: `${wallpaper.width} px`,
  height: `${wallpaper.height} px`,
  encodingFormat: wallpaper.format === 'PNG' ? 'image/png' : 'image/jpeg',
};
```

### CODE 2 — Nhúng JSON-LD vào HTML

**Ngay bên trong JSX của cùng file:**  
**Highlight:** `type="application/ld+json"` và `JSON.stringify(...)`.

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(imageObjectSchema),
  }}
/>
```

### Hai vị trí Schema khác để giới thiệu nhanh

| File | Schema | Dùng để mô tả |
|---|---|---|
| `app/layout.tsx` | `WebSite`, `Organization` | website và thương hiệu |
| `app/page.tsx` | `FAQPage` | danh sách câu hỏi/trả lời ở trang chủ |
| `app/wallpaper/[slug]/page.tsx` | `ImageObject`, `BreadcrumbList` | ảnh và đường dẫn phân cấp |

### Demo cần chỉ ra

DevTools → **Elements** → `Ctrl+F` → tìm `application/ld+json`.
Mở thẻ `<script>` và chỉ ra JSON `@type`, `name`, `contentUrl`.

### F12 — Giải thích từng phần output JSON-LD

Trong **F12 → Elements**, mở một thẻ:

```html
<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ImageObject", ...}
</script>
```

Đối chiếu từng dòng:

```text
@type: ImageObject       → Google biết đây là dữ liệu về hình ảnh
name: wallpaper.title    → tên hình nền
contentUrl: imageUrl     → URL ảnh gốc
width / height           → kích thước ảnh
encodingFormat           → image/png hoặc image/jpeg
```

Mở **F12 → Console** và chạy:

```js
document.querySelectorAll('script[type="application/ld+json"]')
```

Kết quả là danh sách các thẻ JSON-LD đang có trên trang. Có thể nói thêm:
`application/ld+json` là output HTML; còn `JSON.stringify(...)` là code biến
object TypeScript thành chuỗi JSON để nhúng vào thẻ `<script>`.

---

## 🟦 SLIDE 10 — Đối chiếu kết quả SEO

### Mục tiêu kiểm tra

Không chỉ nói “đã có code”, cần kiểm tra output thực tế mà trình duyệt và bot
nhìn thấy:

| Tiêu chí | Code tạo ra kết quả |
|---|---|
| `<title>` riêng theo trang | `generateMetadata().title` |
| Mô tả trang | `generateMetadata().description` |
| Ảnh có văn bản thay thế | `Image alt={...}` |
| Bot có hướng dẫn crawl | `app/robots.ts` |
| Có danh sách URL | `app/sitemap.ts` |
| Có URL chính | `alternates.canonical` |
| Có structured data | `application/ld+json` |

### Cách nói khi trình chiếu

> “Lighthouse là bước đo kết quả, còn sáu trụ cột là các kỹ thuật tạo ra
> kết quả đó. Vì vậy ta vừa xem điểm số, vừa mở source để chứng minh từng tiêu
> chí bằng code và output thật.”

Nếu có ảnh chụp Lighthouse, đặt ảnh ở bên phải slide và khoanh vùng mục **SEO**.

---

## 🟦 SLIDE 11 — Live Demo

### Chuẩn bị và chạy dự án

```bash
npm run build
npm run start
```

Mở `http://localhost:3000`.

### Trình tự demo đề xuất

1. Trang chủ: chỉ ra nội dung, ảnh có `alt` và khu vực FAQ.
2. Trang chi tiết wallpaper: chỉ ra title, description, canonical và JSON-LD.
3. Mở `/robots.txt`: chỉ ra luật crawl và đường dẫn sitemap.
4. Mở `/sitemap.xml`: tìm URL danh mục và wallpaper.
5. Nhấn **F12 → Elements**, mở `<head>` và kiểm tra `<title>`, description,
   canonical, `og:image`, `application/ld+json`.
6. Nhấn **F12 → Network → reload**, chọn **Document** để xem HTML server trả
   về; sau đó chọn `robots.txt` và `sitemap.xml` để xem response tương ứng.
7. Chạy Lighthouse → tab **SEO** → đối chiếu với bảng ở Slide 10.

### Kịch bản nói ngắn khi dùng F12

> “Trong VS Code, đây là code tạo ra dữ liệu SEO. Bây giờ em bấm F12 để kiểm
> chứng output thật trên trình duyệt: trong Elements xem HTML đã sinh ra, trong
> Network xem server đã trả response nào, còn Console dùng để kiểm tra nhanh
> các thẻ JSON-LD.”

### CODE cần mở, theo đúng thứ tự

```text
1. app/wallpaper/[slug]/page.tsx
2. components/DownloadActions.tsx
3. app/robots.ts
4. app/sitemap.ts
5. app/layout.tsx
6. app/page.tsx
```

---

## 🟦 SLIDE 11A — Demo SEO trên Vercel Production

### Deploy rồi thì khác gì?

Về code SEO, các trụ cột vẫn giống local. Điểm khác là phải kiểm tra **output
trên domain thật**, vì Google sẽ crawl URL production chứ không crawl
`localhost`.

Trong production cần kiểm tra thêm:

1. `NEXT_PUBLIC_BASE_URL` phải là domain gốc của website.
2. Canonical, Open Graph và sitemap phải dùng HTTPS.
3. URL phải đúng domain và đúng route hiện tại, không bị nối thêm path của một
   wallpaper khác.
4. Ảnh trong `og:image`, `ImageObject.contentUrl` phải truy cập được từ
   Internet.
5. Dùng Lighthouse ở chế độ mobile và kiểm tra cả trang chủ lẫn trang chi tiết.

### Cấu hình Vercel cần nói rõ

Trong **Vercel → Project → Settings → Environment Variables**, đặt:

```text
NEXT_PUBLIC_BASE_URL=https://seo-deployment.vercel.app
```

Không đặt:

```text
https://seo-deployment.vercel.app/
https://seo-deployment.vercel.app/wallpaper/cyberpunk-2077-night-city-neon
```

Sau khi sửa Environment Variable, cần **Redeploy** để giá trị được dùng trong
build production. File `.env.local` trên máy không tự động thay đổi biến môi
trường đã lưu trong Vercel.

### Output đúng cần thấy trên production

Với trang:

```text
https://seo-deployment.vercel.app/wallpaper/elden-ring-shadow-of-the-erdtree
```

Trong **F12 → Elements → `<head>`**, canonical đúng phải là:

```html
<link rel="canonical"
  href="https://seo-deployment.vercel.app/wallpaper/elden-ring-shadow-of-the-erdtree">
```

Trong **F12 → Network**, các request cần kiểm tra là:

```text
https://seo-deployment.vercel.app/
https://seo-deployment.vercel.app/robots.txt
https://seo-deployment.vercel.app/sitemap.xml
https://seo-deployment.vercel.app/wallpaper/elden-ring-shadow-of-the-erdtree
```

Trong response `/robots.txt`, dòng sitemap đúng phải là:

```text
Sitemap: https://seo-deployment.vercel.app/sitemap.xml
```

Trong response `/sitemap.xml`, các thẻ `<loc>` phải bắt đầu bằng:

```text
https://seo-deployment.vercel.app/
```

### Output hiện tại cần sửa trước khi trình bày

Khi kiểm tra live URL, output hiện tại đang có dạng:

```text
https://seo-deployment.vercel.app/wallpaper/cyberpunk-2077-night-city-neon/sitemap.xml
```

và canonical của trang Elden Ring đang bị nối thành:

```text
https://seo-deployment.vercel.app/wallpaper/cyberpunk-2077-night-city-neon/wallpaper/elden-ring-shadow-of-the-erdtree
```

Đây là **lỗi cấu hình base URL production**, không phải lỗi của
`alternates.canonical` hay `app/sitemap.ts`. Trước khi demo, sửa Environment
Variable trên Vercel về domain gốc, Redeploy, rồi kiểm tra lại F12.

### Kịch bản nói khi demo production

> “Ở local, em kiểm tra với `localhost`. Sau khi deploy, em kiểm tra lại đúng
> các output này trên domain Vercel vì đây mới là URL bot sẽ crawl. Code
> `generateMetadata`, `robots.ts` và `sitemap.ts` không đổi; chỉ cần bảo đảm
> base URL production là domain gốc để tất cả URL SEO sinh ra chính xác.”

---

## 🟦 SLIDE 12 — Tổng kết

```text
Next.js App Router
        ↓
Server-rendered content + metadata rõ ràng
        ↓
Bot dễ crawl, dễ hiểu URL và ngữ nghĩa nội dung
        ↓
6 trụ cột kỹ thuật hỗ trợ nền tảng SEO của dự án
```

### Câu kết

> “SEO không chỉ là thêm từ khóa. Trong dự án này, ta chuẩn bị nội dung ở
> server, mô tả metadata theo từng trang, hướng dẫn bot crawl, chuẩn hóa URL
> và cung cấp dữ liệu có cấu trúc để công cụ tìm kiếm hiểu đúng website.”

---

## Ghi chú khi show code

1. Dùng VS Code cho phần code, tăng cỡ chữ khoảng 18–20px.
2. Mỗi lần chỉ highlight **một đoạn có mục đích rõ ràng**, không cuộn cả file.
3. Luôn đọc tên file trước khi đọc code: “Đây là `app/robots.ts`, nơi tạo
   output `/robots.txt`.”
4. Sau mỗi đoạn code, nhấn **F12** và mở đúng tab:
   - **Elements**: xem HTML, `<head>`, canonical, metadata, JSON-LD.
   - **Network**: xem request/response của Document, `robots.txt`,
     `sitemap.xml`.
   - **Console**: kiểm tra nhanh số lượng thẻ JSON-LD.
   - **Lighthouse**: đo các tiêu chí SEO.
5. Sau F12, mở output tương ứng trong trình duyệt nếu cần: `/robots.txt` và
   `/sitemap.xml`.
6. Khi demo production, luôn kiểm tra domain thật và HTTPS; không chỉ kiểm tra
   `localhost`.
7. Không nói “Google không thể đọc JavaScript”. Cách nói chính xác hơn là:
   “Ta không nên bắt toàn bộ nội dung SEO phụ thuộc vào JavaScript phía client;
   Next.js giúp render nội dung quan trọng từ server và chỉ đưa phần tương tác
   sang client.”
