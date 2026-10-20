import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { iconForPath, iconSize, markForPath } from "@/lib/icons";
import { locate } from "./nav";

interface Props {
  actions?: ReactNode;
  children: ReactNode;
}

// Chronus page pattern: a header with a hairline underneath, then a padded body.
// The shell's sr-only h1 (TopBar) is the page's only h1, so the visible title is an h2.
export const PageHeader = ({ actions, children }: Props) => {
  const { pathname } = useLocation();
  // The page's name and description come from nav.ts, the same source as the sidebar, the top bar and the document title.
  const { title, description: subtitle } = locate(pathname);
  const PageIcon = iconForPath(pathname);
  const mark = markForPath(pathname);
  return (
  <>
    <header className="z-10 border-b border-hairline bg-page px-4 py-4 sm:px-5 md:sticky md:top-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {mark && <img src={mark} alt="" width={44} height={44} className="hidden size-11 shrink-0 object-contain sm:block" />}
            <h2 className="type-display-lg sm:type-display-xl flex items-center gap-2.5 text-foreground">
              {PageIcon && <PageIcon className={`${iconSize.bar} shrink-0 text-icon-tertiary ${mark ? "sm:hidden" : ""}`} aria-hidden />}
              {title}
            </h2>
          </div>
          {subtitle && <p className="type-body-md mt-1 max-w-[70ch] text-tertiary">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
    <div className="space-y-4 p-4 sm:p-5">{children}</div>
  </>
  );
};

export default PageHeader;
