import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("campaigns");

export default function Page() {
  return <SectionPlaceholder section="campaigns" phase={10} />;
}
