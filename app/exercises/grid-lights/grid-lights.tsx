"use client";

// The question can be split into two parts: (1) Rendering, (2) State, and (3) Deactivation.

import { useId, useState } from "react";

const defaultConfig = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

export default function GridLights({
  config = defaultConfig,
  interval = 500,
}: {
  config?: number[][];
  interval?: number;
}) {
  const id = useId();
  const [clickedItems, setClickedItems] = useState<number[]>([]);
  const [deactivating, setDeactiviating] = useState(false);

  function deactivateCells() {
    setDeactiviating(true);

    const timer = setInterval(() => {
      setClickedItems((origOrder) => {
        const newOrder = origOrder.slice();
        newOrder.pop();

        if (newOrder.length === 0) {
          clearInterval(timer);
          setDeactiviating(false);
        }

        return newOrder;
      });
    }, interval);
  }

  function handleClick(index: number) {
    const lengthOfCells = config.flat().filter(Boolean).length;

    const newClickedItems = [...clickedItems, index];
    setClickedItems(newClickedItems);

    if (newClickedItems.length === lengthOfCells) {
      deactivateCells();
      return;
    }
  }

  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${config[0].length}, 1fr)`,
      }}
    >
      {config.flat().flatMap((value, index) => {
        if (!value) return <span key={id + index} />;

        return (
          <Cell
            label={`Cell ${index}`}
            key={id + index}
            isDisabled={clickedItems.includes(index) || deactivating}
            onClick={() => handleClick(index)}
            filled={clickedItems.includes(index)}
          />
        );
      })}
    </div>
  );
}

function Cell({
  isDisabled,
  onClick,
  filled,
  label,
}: {
  isDisabled: boolean;
  onClick: () => void;
  filled: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid-item"
      style={{
        backgroundColor: filled ? "red" : "white",
      }}
      disabled={isDisabled}
      onClick={onClick}
    />
  );
}
