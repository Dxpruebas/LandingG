import { SectionPlaceholder, sectionMetadata } from "@/components/app-shell/section-placeholder";

export const generateMetadata = () => sectionMetadata("orders");

export default function Page() {
  return <SectionPlaceholder section="orders" phase={7} />;
}
