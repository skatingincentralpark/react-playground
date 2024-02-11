import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Tabs from "./tabs";
import userEvent from "@testing-library/user-event";

function TabsExample() {
  return (
    <Tabs
      items={[
        {
          value: "html",
          label: "HTML",
          panel:
            "The HyperText Markup Language or HTML is the standard markup language for documents designed to be displayed in a web browser.",
        },
        {
          value: "css",
          label: "CSS",
          panel:
            "Cascading Style Sheets is a style sheet language used for describing the presentation of a document written in a markup language such as HTML or XML.",
        },
        {
          value: "javascript",
          label: "JavaScript",
          panel:
            "JavaScript, often abbreviated as JS, is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
        },
      ]}
    />
  );
}

describe("initialisation", () => {
  it("renders", () => {
    render(<TabsExample />);
  });

  it("should display all provided items", () => {
    render(<TabsExample />);
    screen.getByRole("tab", { name: "HTML" });
    screen.getByRole("tab", { name: "CSS" });
    screen.getByRole("tab", { name: "JavaScript" });
  });

  it("should render default panel, the other two should be hidden", () => {
    render(<TabsExample />);
    const visiblePanels = screen.getAllByRole("tabpanel");
    const allPanels = screen.getAllByRole("tabpanel", { hidden: true });
    expect(visiblePanels).toHaveLength(1);
    expect(allPanels).toHaveLength(3);
  });

  it("should highlight the active button", () => {
    render(<TabsExample />);
    expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
  });

  it("allows initialisation of multiple instances, with independant states", async () => {
    render(
      <>
        <TabsExample />
        <TabsExample />
      </>,
    );

    const user = userEvent.setup();

    expect(
      screen.getAllByRole("tab", { name: "HTML", selected: true }),
    ).toHaveLength(2);

    await user.click(screen.getAllByRole("tab", { name: "CSS" })[1]);

    expect(
      screen.getAllByRole("tab", { name: "CSS", selected: true }),
    ).toHaveLength(1);

    expect(
      screen.getAllByRole("tab", { name: "HTML", selected: true }),
    ).toHaveLength(1);
  });
});

describe("click behaviour", () => {
  it("should only show one panel and update panel to new content on clicking new tab", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "CSS" }));
    expect(screen.getByRole("tabpanel", { name: "CSS" })).toBeVisible();
    expect(screen.queryAllByRole("tabpanel")).toHaveLength(1);
    await user.click(screen.getByRole("tab", { name: "JavaScript" }));
    expect(screen.getByRole("tabpanel", { name: "JavaScript" })).toBeVisible();
    expect(screen.queryAllByRole("tabpanel")).toHaveLength(1);
  });

  it("should change focus and selected state on clicking new tab", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "CSS", selected: false }));
    expect(
      screen.getByRole("tab", { name: "CSS", selected: true }),
    ).toHaveFocus();
    expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
    await user.click(screen.getByRole("tab", { name: "JavaScript" }));
    expect(
      screen.getByRole("tab", { name: "JavaScript", selected: true }),
    ).toHaveFocus();
    expect(screen.getAllByRole("tab", { selected: true })).toHaveLength(1);
  });
});

describe("correct panels when switching tabs with keyboard", () => {
  it("should change the panel when left key is pressed and loop around", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "HTML" }));
    expect(screen.getByRole("tabpanel", { name: "HTML" })).toBeVisible();
    await user.keyboard("{arrowleft}");
    expect(screen.getByRole("tabpanel", { name: "JavaScript" })).toBeVisible();
    await user.keyboard("{arrowleft}");
    expect(screen.getByRole("tabpanel", { name: "CSS" })).toBeVisible();
  });

  it("should change the panel when right key is pressed and loop around", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(document.body);
    await user.tab();
    expect(screen.getByRole("tabpanel", { name: "HTML" })).toBeVisible();
    await user.keyboard("{arrowright}");
    expect(screen.getByRole("tabpanel", { name: "CSS" })).toBeVisible();
    await user.keyboard("{arrowright}{arrowright}");
    expect(screen.getByRole("tabpanel", { name: "HTML" })).toBeVisible();
  });
});

describe("focus behavior", () => {
  it("should focus on the active tab element when tabbing from outside, not necessarily the first tab", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "CSS" }));
    await user.click(document.body);
    await user.tab();
    expect(screen.getByRole("tab", { name: "CSS" })).toHaveFocus();
  });

  it("should focus on the tabpanel when shift+tabbing from outside, not any of the tabs", async () => {
    render(
      <div>
        <TabsExample />
        <button>Outside</button>
      </div>,
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Outside" }));
    await user.keyboard("{Shift>}{tab}{/Shift}");
    expect(screen.getByRole("tabpanel")).toHaveFocus();
  });

  it("should focus on the new tab when switching between the tabs using the keyboard", async () => {
    render(<TabsExample />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("tab", { name: "HTML" }));
    await user.keyboard("{arrowright}");
    expect(screen.getByRole("tab", { name: "CSS" })).toHaveFocus();
    await user.keyboard("{arrowright}");
    expect(screen.getByRole("tab", { name: "JavaScript" })).toHaveFocus();
  });
});
