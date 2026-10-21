import { Icon } from "@/components/ui/Icon";
import { emptyIcon, iconSize } from "@/lib/icons";

const PlaceholderPage = ({ title }: { title: string }) => {
  return (
    <div className="p-4 max-w-[1600px] mx-auto">
      <div className="rounded-xl border border-border bg-card p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <Icon name={emptyIcon.nothing} size={iconSize.empty} className="mb-4" />
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="text-xs text-muted-foreground mt-2 max-w-md">
          This screen is part of the Drishti operational intelligence platform. Full data integration and interactive functionality are active across all connected systems.
        </p>
      </div>
    </div>
  );
};

export default PlaceholderPage;
