import { useTheme } from "@/hooks/useTheme";
import { Toaster as Sonner, toast } from "sonner";
import { Icon } from "./Icon";
import { iconSize, statusIcon } from "@/lib/icons";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme(); // the app theme (not the OS colour scheme), so a toast matches the page it appears on

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <Icon name={statusIcon.success} size={iconSize.row} />,
        info: <Icon name={statusIcon.info} size={iconSize.row} />,
        warning: <Icon name={statusIcon.warning} size={iconSize.row} />,
        error: <Icon name={statusIcon.error} size={iconSize.row} />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-container group-[.toaster]:text-foreground group-[.toaster]:border-hairline group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
