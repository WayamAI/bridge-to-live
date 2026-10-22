import React from "react";
import { useTheme } from "@/hooks/useTheme";
import logoLight from "@/assets/logos/wayam-logo-light.svg";
import logoDark from "@/assets/logos/wayam-logo-dark.svg";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

export default function Logo({ size = 28, showText = true }: LogoProps) {
  const { theme } = useTheme();
  const src = theme === "dark" ? logoDark : logoLight;

  return (
    <div className="flex items-center gap-2" style={{ lineHeight: 1 }}>
      <img src={src} alt="Wayam AI" width={size} height={size} className="shrink-0" />
      {showText && (
        <span className="font-bold text-sm text-foreground">
          Drishti
        </span>
      )}
    </div>
  );
}
