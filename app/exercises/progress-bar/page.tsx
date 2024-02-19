"use client";

import { useCallback, useEffect, useState } from "react";
import "./styles.css";

function ProgressBar({
  onCompleted,
  ready,
}: {
  onCompleted: () => void;
  ready: boolean;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!ready) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);

          return 100;
        }

        return p + 0.005 * 100;
      });
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, [ready, onCompleted]);

  useEffect(() => {
    if (progress >= 100) {
      onCompleted();
    }
  }, [progress, onCompleted]);

  return (
    <div className="progess-bar" role="progressbar">
      <div
        className={["bar-contents"].filter(Boolean).join(" ")}
        style={{ transform: `scaleX(${progress / 100})` }}
      />
      <div className="progress-label">{progress}%</div>
    </div>
  );
}

const CONCURRENCY_COUNT = 3;

export default function Page() {
  const [bars, setBars] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [paused, setPaused] = useState(false);

  const onCompleted = useCallback(
    () => setCompleted((c) => c + 1),
    [setCompleted]
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button onClick={() => setBars((b) => b + 1)}>Add</button>
        <button onClick={() => setPaused((p) => !p)}>
          {paused ? "Resume" : "Pause"}
        </button>
        <div className="info-label">
          Completed: {completed} / {bars}
        </div>
        <div className="info-label">Max bars at once: {CONCURRENCY_COUNT}</div>
      </div>
      <div className="flex flex-col gap-2">
        {Array(bars)
          .fill(null)
          .map((_, i) => (
            <ProgressBar
              key={i}
              onCompleted={onCompleted}
              ready={
                !paused && (i === 0 || i <= completed + CONCURRENCY_COUNT - 1)
              }
            />
          ))}
      </div>
    </div>
  );
}
