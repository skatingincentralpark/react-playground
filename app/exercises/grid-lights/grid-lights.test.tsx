import { expect, it, describe, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import GridLights from "./grid-lights";
import userEvent from "@testing-library/user-event";
// https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning
import { act } from "react-dom/test-utils";

describe("when initialised", () => {
  it("renders", () => {
    render(<GridLights />);
  });

  it("should display all cells", () => {
    render(<GridLights />);
    const cells = screen.getAllByRole("button");
    expect(cells).toHaveLength(8);
  });
});

describe("click behaviour", () => {
  it("shouldn't have any effect when clicking on a cell that is already active", async () => {
    const user = userEvent.setup();
    render(<GridLights />);
    const cell = screen.getByRole("button", { name: "Cell 0" });
    expect(cell).toBeEnabled();
    await user.click(cell);
    expect(cell).toBeDisabled();
  });

  it("should deactivate sequentially when all cells are clicked", async () => {
    const user = userEvent.setup();
    const INTERVAL = 500;

    render(<GridLights interval={INTERVAL} />);
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const cells = screen.getAllByRole("button");
    const orderToClick = [4, 1, 3, 7, 6, 0, 2, 5];

    expect(cells.length).toEqual(orderToClick.length);

    for (let i = 0; i <= orderToClick.length; i++) {
      await user.click(cells[orderToClick[i]]);
    }

    act(() => vi.advanceTimersByTime(INTERVAL));

    // wait for name: "cell 5" to be white
    await waitFor(() => {
      return expect(cells[5]).toHaveStyle({
        ["background-color"]: "rgb(255, 255, 255)",
      });
    });

    // expect 7 cells to be red
    expect(
      cells.filter((cell) => {
        return cell.style.backgroundColor === "red";
      }).length
    ).toEqual(7);

    act(() => vi.advanceTimersByTime(INTERVAL * 3));

    // wait for name: "cell 6" to be white
    await waitFor(() => {
      return expect(cells[6]).toHaveStyle({
        ["background-color"]: "rgb(255, 255, 255)",
      });
    });

    // expect 4 cells to be red
    expect(
      cells.filter((cell) => {
        return cell.style.backgroundColor === "red";
      }).length
    ).toEqual(4);
  });
});
