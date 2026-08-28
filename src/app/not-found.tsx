import { PlaceholderPage } from '@/components/sections/placeholder-page';
import { siteConfig } from '@/content';

export default function NotFoundPage() {
  return (
    <PlaceholderPage
      site={siteConfig}
      eyebrow="404"
      title="NOT FOUND"
      titleZh="找不到頁面"
      location="RETURN HOME"
      locationZh="返回首頁"
      mediaId="site.home-hero"
      cta={{ label: 'HOME', href: '/' }}
    />
  );
}
