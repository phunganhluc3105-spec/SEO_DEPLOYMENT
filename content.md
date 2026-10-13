Tài liệu của Next.js tuy dài nhưng các kỹ thuật SEO thực chiến trong Next.js App Router có thể tóm gọn thành **6 trụ cột kỹ thuật cốt lõi** dưới đây:

---

### 1. Phân biệt Server Components & Client Components
* **Quy tắc cơ bản**: Luôn mặc định toàn bộ trang (`page.tsx`) là **Server Component**. Khi server render sẵn bản HTML hoàn chỉnh chứa đầy đủ văn bản, tiêu đề và metadata, Googlebot/Bingbot cào dữ liệu sẽ lập tức đọc hiểu nội dung mà không phải chờ tải tệp JavaScript.
* **Cách xử lý tương tác**: Nếu trang cần tương tác (như sự kiện nhấp nút, React hooks `useState`, `useRef`), **không dùng `'use client'` ở trang chính**. Hãy tách phần tương tác đó thành một component con nhỏ hơn và đặt `'use client'` ở riêng tệp đó.

---

### 2. Triển khai Metadata (Tĩnh & Động)

#### a. Static Metadata (Trang cố định như About, Contact)
Trong các tệp `page.tsx` hoặc `layout.tsx` dạng Server Component, bạn chỉ cần export một hằng số `metadata` chuẩn kiểu `Metadata`:

```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Món Ăn Ngon - Công Thức Nấu Ăn', // Hiển thị trên thẻ trình duyệt & SERP
  description: 'Khám phá các công thức nấu ăn ngon nhất tại nhà.', //
  keywords: ['món ăn', 'công thức', 'nấu ăn'], //
  openGraph: { // Tối ưu hiển thị khi chia sẻ link lên Facebook, LinkedIn, Slack
    title: 'Món Ăn Ngon',
    description: 'Khám phá các công thức nấu ăn ngon nhất tại nhà.',
    url: '[suspicious link removed]',
    siteName: 'Recipes.com',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }], //
    locale: 'vi_VN',
    type: 'website', //
  },
  twitter: { // Tối ưu hiển thị thẻ Twitter Card
    card: 'summary_large_image',
    title: 'Món Ăn Ngon',
    description: 'Khám phá các công thức nấu ăn ngon nhất tại nhà.',
    creator: '@recipes',
  },
  robots: { // Điều khiển bot index & follow
    index: true,
    follow: true,
    googleBot: {
      'max-snippet': -1,
      'max-image-preview': 'large', //
    },
  },
};
```

#### b. Dynamic Metadata (Trang động như Chi tiết Sản phẩm, Bài viết)
Đối với các route động như `/products/[id]`, bạn export một hàm bất đồng bộ `generateMetadata({ params })`:

```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct([đã xoá đường liên kết đáng ngờ]); // Lấy thông tin sản phẩm từ API/DB

  if (!product) {
    return { title: 'Không tìm thấy sản phẩm' }; //
  }

  return {
    title: `${[đã xoá đường liên kết đáng ngờ]} - ${product.brand} | Recipes.com`, // Lấy tên sản phẩm động
    description: `${product.description} - Giá: ${product.price}đ. Tình trạng: ${product.inStock ? 'Còn hàng' : 'Hết hàng'}`, //
  };
}
```

---

### 3. Điều hướng Bot với `app/robots.ts`
Thay vì tạo file `.txt` thủ công, Next.js cho phép viết tệp TypeScript `app/robots.ts` để tự động xuất ra `robots.txt`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = [đã xoá đường liên kết đáng ngờ]_PUBLIC_BASE_URL || '[suspicious link removed]';

  return {
    rules: [
      {
        userAgent: '*', // Áp dụng cho tất cả các bot
        allow: '/',
        disallow: ['/api/', '/admin/', '/terms/'], // Chặn bot vào các đường dẫn riêng tư
      },
      {
        userAgent: 'MJ12bot', // Chặn riêng các bot cào dữ liệu gây hao tốn tài nguyên
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`, // Khai báo đường dẫn Sitemap cho bot
  };
}
```

---

### 4. Tự động tạo Sơ đồ trang web với `app/sitemap.ts`
Tạo tệp `app/sitemap.ts` ở thư mục gốc `app/` để Next.js sinh ra tệp `sitemap.xml` hợp lệ:

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = [đã xoá đường liên kết đáng ngờ]_PUBLIC_BASE_URL || '[suspicious link removed]';

  // Lấy danh sách ID bài viết/sản phẩm từ database nếu là sitemap động
  const products = await getAllProducts();
  const productEntries = [đã xoá đường liên kết đáng ngờ]((p) => ({
    url: `${baseUrl}/products/${[đã xoá đường liên kết đáng ngờ]}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl, // Trang chủ
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // Ưu tiên cao nhất
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...productEntries,
  ];
}
```

---

### 5. Chống phạt lặp nội dung với Canonical URLs
Nhiều URL chứa các tham số lọc/tìm kiếm (ví dụ: `/products/123?color=black` và `/products/123?size=15`) có nội dung giống hệt nhau, dễ bị Google phạt trùng lặp nội dung (duplicate content).

Trong phần metadata của trang, khai báo trường `alternates.canonical` bằng **URL tuyệt đối**:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    // ... các thuộc tính khác
    alternates: {
      canonical: `[suspicious link removed]{[đã xoá đường liên kết đáng ngờ]}`, // Bot sẽ hiểu đây là URL chuẩn gốc
    },
  };
}
```

---

### 6. Nhúng Dữ liệu Cấu trúc JSON-LD ([đã xoá đường liên kết đáng ngờ])
JSON-LD giúp bot và các trợ lý AI hiểu sâu hơn về loại nội dung (Sản phẩm, Bài viết, Đánh giá...) để hiển thị các **Rich Snippets** (kết quả hiển thị số sao, giá cả, tác giả) trên trang kết quả tìm kiếm.

```typescript
export default async function ProductPage({ params }) {
  const product = await getProduct([đã xoá đường liên kết đáng ngờ]);

  const structuredData = {
    '@context': '[suspicious link removed]',
    '@type': 'Product', // Định nghĩa kiểu dữ liệu theo [đã xoá đường liên kết đáng ngờ]
    name: [đã xoá đường liên kết đáng ngờ],
    image: product.image,
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: '[suspicious link removed]',
    },
  };

  return (
    <main>
      {/* Nhúng mã JSON-LD qua thẻ script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} //
      />
      <h1>{[đã xoá đường liên kết đáng ngờ]}</h1>
      {/* UI nội dung sản phẩm */}
    </main>
  );
}
```

---

🎯 **Mẹo kiểm tra**: Khi hoàn thành, bạn chỉ cần chạy dự án, mở **Chrome DevTools (F12) -> tab Lighthouse -> chọn Analyze page load** để kiểm tra điểm số SEO và phát hiện ngay các lỗi thiếu sót như hỏng đường dẫn `robots.txt` hay thiếu thẻ `alt`.

Bạn có cần mình giải thích sâu thêm về phần cấu hình nào trong các trụ cột trên không?