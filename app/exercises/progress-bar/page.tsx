"use client";

import { useEffect, useState } from "react";
import "./styles.css";

function ProgressBar({
  time,
  onCompleted,
  ready,
}: {
  time: number;
  onCompleted: () => void;
  ready: boolean;
}) {
  const [startTransition, setStartTransition] = useState(false);

  useEffect(() => {
    if (!ready) return;
    setStartTransition(true);
  }, [setStartTransition, ready]);

  return (
    <div className="progess-bar" role="progressbar">
      <div
        className={[
          "bar-contents",
          startTransition ? "bar-contents--filled" : null,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          ["--time" as string]: `${time}ms`,
        }}
        onTransitionEnd={onCompleted}
      />
    </div>
  );
}

export default function Page() {
  const [bars, setBars] = useState(0);
  const [barsFilled, setBarsFilled] = useState(0);

  return (
    <div>
      <button onClick={() => setBars((b) => b + 1)}>Add</button>
      {Array(bars)
        .fill(null)
        .map((_, i) => (
          <ProgressBar
            key={i}
            time={2000}
            onCompleted={() => {
              setBarsFilled((b) => b + 1);
            }}
            ready={i === 0 || i < barsFilled + 3}
          />
        ))}
    </div>
  );
}
