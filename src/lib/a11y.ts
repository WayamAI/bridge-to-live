import type { KeyboardEvent } from "react";

/**
 * Props that make a clickable row, header or card work from the keyboard: focusable, and Enter or Space does what a
 * click does. Key presses that start in a control inside it (a button, an input) are left alone.
 */
export const activatable = (onActivate: () => void) => ({
  tabIndex: 0,
  onClick: onActivate,
  onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // Space would otherwise scroll the page
      onActivate();
    }
  },
});

/** Focus ring for an activatable element; an inset outline, because box-shadow rings do not draw on table rows. */
export const activatableFocus = "outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-active";
