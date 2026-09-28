import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("help");

export default function Page() {
  return <SectionPlaceholder section="help" phase={12} />;
}
