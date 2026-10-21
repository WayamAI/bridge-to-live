import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Generated 3D icons (src/assets/icons/{48,96}). Vite emits each PNG as its own file, so an icon is fetched
// when an <img> using it first renders: the sidebar's load with the shell, a page's own load with that page.
const files = import.meta.glob<string>("../../assets/icons/{48,96}/*.png", { eager: true, query: "?url", import: "default" });

export type IconName = string;

/** The 48px file serves 24px and below (2x for a 24px icon), the 96px file anything larger. */
const folderFor = (size: number) => (size <= 24 ? "48" : "96");

export const iconUrl = (name: IconName, size: number): string | undefined => files[`../../assets/icons/${folderFor(size)}/${name}.png`];

/** Every icon file name that exists (without extension), for tests. */
export const iconFileNames = (): string[] =>
  Object.keys(files)
    .filter((k) => k.includes("/48/"))
    .map((k) => k.slice(k.lastIndexOf("/") + 1, -4));

interface IconProps {
  name: IconName;
  /** Rendered size in px (see `iconSize` in lib/icons.ts). */
  size: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Decorative icon: `alt=""` and aria-hidden, so the text beside it (or the button's aria-label) is the name.
 * Images cannot take `currentColor`: a state that used to change an icon's colour changes opacity or a filter instead.
 */
export const Icon = ({ name, size, className, style }: IconProps) => (
  <img
    src={iconUrl(name, size)}
    alt=""
    aria-hidden
    width={size}
    height={size}
    draggable={false}
    decoding="async"
    style={style}
    className={cn("pointer-events-none inline-block shrink-0 select-none object-contain", className)}
  />
);

export default Icon;
