import { CategoryTick } from "@/components/dashboard/chartKit";
import { useIsMobile } from "@/hooks/use-mobile";

/** Width and label length for a category (Y) axis: narrower on phones. */
export const useCategoryAxis = () => {
  const mobile = useIsMobile();
  const width = mobile ? 92 : 132;
  const maxChars = mobile ? 14 : 22;
  return { width, tick: <CategoryTick maxChars={maxChars} /> };
};
