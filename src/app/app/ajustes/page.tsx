import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("settings");

export default function Page() {
  return <SectionPlaceholder section="settings" phase={3} />;
}
