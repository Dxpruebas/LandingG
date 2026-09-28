import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("credits");

export default function Page() {
  return <SectionPlaceholder section="credits" phase={4} />;
}
