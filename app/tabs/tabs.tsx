"use client";
import { useId, useState } from "react";

interface Tab {
  value: string;
  label: string;
  panel: string;
}

function getTabButtonId(tabsId: string, value: string) {
  return tabsId + "-tab-" + value;
}

function getTabPanelId(tabsId: string, value: string) {
  return tabsId + "-tabpanel-" + value;
}

export default function Tabs({
  items,
  defaultActiveItem,
}: {
  items: Tab[];
  defaultActiveItem?: string;
}) {
  const [activeItem, setActiveItem] = useState(
    defaultActiveItem ?? items[0].value,
  );
  const id = useId();

  function focusTabViaIndex(index: number) {
    const newValue = items[index].value;
    setActiveItem(newValue);
    document.getElementById(getTabButtonId(id, newValue))?.focus();
  }

  return (
    <div className="tabs-wrapper">
      <div
        role="tablist"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            const index = items.findIndex((item) => item.value === activeItem);
            focusTabViaIndex((index + 1) % items.length);
            return;
          }
          if (event.key === "ArrowLeft") {
            const index = items.findIndex((item) => item.value === activeItem);
            focusTabViaIndex((index - 1 + items.length) % items.length);
            return;
          }
        }}
      >
        {items.map((item) => {
          const active = item.value === activeItem;

          return (
            <button
              role="tab"
              tabIndex={active ? 0 : -1}
              key={item.value}
              className={[active && "active"].filter((cn) => cn).join(" ")}
              onClick={() => setActiveItem(item.value)}
              id={getTabButtonId(id, item.value)}
              aria-selected={active}
              aria-controls={getTabPanelId(id, item.value)}
              data-state={active}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div>
        {items.map((item) => (
          <div
            role="tabpanel"
            tabIndex={0}
            key={`${item.value}`}
            hidden={item.value !== activeItem}
            id={getTabPanelId(id, item.value)}
            aria-labelledby={getTabButtonId(id, item.value)}
          >
            {item.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
