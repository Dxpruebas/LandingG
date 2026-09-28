import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("creativeTests");

export default function Page() {
  return <SectionPlaceholder section="creativeTests" phase={8} />;
}
