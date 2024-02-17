import { it, describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LikeButton from "./like-button";
import userEvent from "@testing-library/user-event";

function mockRequest({ successful }: { successful: boolean }) {
  const res = {
    ok: successful,
    json: async () => ({ message: successful ? "" : "Something went wrong" }),
  };

  window.fetch = vi
    .fn()
    .mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve(res), 5))
    );
}

describe("when initialised", () => {
  it("renders", () => {
    render(<LikeButton />);
  });
});

describe("while in default (unliked) state", () => {
  it.todo("shows the hovered state on hover", async () => {
    // hmmm..
  });
  it("shows a loading spinner when clicked", async () => {
    render(<LikeButton />);
    const button = screen.getByRole("button");
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByRole("progressbar");
  });
  it("transitions to liked state on successful request", async () => {
    mockRequest({ successful: true });

    render(<LikeButton />);
    const button = screen.getByRole("button", { name: /like/i });
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByRole("button", { name: /unlike/i });
  });
  it("shows an error message on failed request", async () => {
    mockRequest({ successful: false });

    render(<LikeButton />);
    const button = screen.getByRole("button", { name: /like/i });
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByText(/something went wrong/i);
  });
});

describe("while in liked state", () => {
  it.todo("does not show the hovered state on hover", async () => {
    // hmmm..
  });
  it("shows a loading spinner when clicked", async () => {
    mockRequest({ successful: true });

    render(<LikeButton defaultLiked />);
    const button = screen.getByRole("button", { name: /unlike/i });
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByRole("progressbar");
  });
  it("transitions to default state on successful request", async () => {
    mockRequest({ successful: true });

    render(<LikeButton defaultLiked />);
    const button = screen.getByRole("button", { name: /unlike/i });
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByRole("button", { name: /like/i });
  });
  it("shows an error message on failed request", async () => {
    mockRequest({ successful: false });

    render(<LikeButton defaultLiked />);
    const button = screen.getByRole("button", { name: /unlike/i });
    const user = userEvent.setup();
    await user.click(button);
    await screen.findByText(/something went wrong/i);
  });
});
