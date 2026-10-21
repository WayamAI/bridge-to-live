import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { activatable } from "@/lib/a11y";

const Row = ({ onActivate }: { onActivate: () => void }) => (
  <table>
    <tbody>
      <tr data-testid="row" {...activatable(onActivate)}>
        <td>
          <button>inner</button>
        </td>
      </tr>
    </tbody>
  </table>
);

describe("activatable", () => {
  it("makes the row focusable and runs on click", () => {
    const fn = vi.fn();
    render(<Row onActivate={fn} />);
    expect(screen.getByTestId("row")).toHaveAttribute("tabindex", "0");
    fireEvent.click(screen.getByTestId("row"));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("runs on Enter and on Space, and stops Space from scrolling", () => {
    const fn = vi.fn();
    render(<Row onActivate={fn} />);
    const row = screen.getByTestId("row");
    fireEvent.keyDown(row, { key: "Enter" });
    expect(fireEvent.keyDown(row, { key: " " })).toBe(false); // preventDefault was called
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("ignores other keys and keys pressed in a control inside the row", () => {
    const fn = vi.fn();
    render(<Row onActivate={fn} />);
    fireEvent.keyDown(screen.getByTestId("row"), { key: "a" });
    fireEvent.keyDown(screen.getByText("inner"), { key: "Enter" });
    expect(fn).not.toHaveBeenCalled();
  });
});
