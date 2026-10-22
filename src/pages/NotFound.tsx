import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { locate } from "@/components/layout/nav";
import { Icon } from "@/components/ui/Icon";
import { iconSize, notFoundIcon } from "@/lib/icons";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = `${locate(location.pathname).title} · Drishti`;
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4">
      <div className="flex flex-col items-center gap-1.5 text-center">
        <Icon name={notFoundIcon} size={iconSize.notFound} className="mb-2" />
        <h1 className="type-display-2xl tabular text-foreground">404</h1>
        <p className="type-body-md text-tertiary">Page not found</p>
        <a
          href="/"
          className="type-label-sm mt-4 inline-flex h-8 items-center rounded-full border border-hairline bg-action px-3 text-secondary-foreground outline-none transition-colors duration-[180ms] hover:border-strong hover:bg-raised-2 hover:text-foreground focus-visible:ring-2 focus-visible:ring-active"
        >
          Return to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
