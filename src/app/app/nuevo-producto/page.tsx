import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("newProduct");

export default function Page() {
  return <SectionPlaceholder section="newProduct" phase={5} />;
}
