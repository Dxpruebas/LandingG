import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("products");

export default function Page() {
  return <SectionPlaceholder section="products" phase={6} />;
}
