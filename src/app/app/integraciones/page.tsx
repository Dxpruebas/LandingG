import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("integrations");

export default function Page() {
  return <SectionPlaceholder section="integrations" phase={10} />;
}
