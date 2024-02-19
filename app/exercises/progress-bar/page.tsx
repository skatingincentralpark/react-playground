"use client";

import { useState } from "react";
import "./styles.css";

function ProgressBar({ progress }: { progress: number }) {
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

const CONCURRENCY_LIMIT = 3;

export default function Page() {
  const [progression, setProgression] = useState<number[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  function start() {
    const interval = setInterval(() => {
      setProgression((currProgression) => {
        const nonFull = currProgression
          .map((progress, index) => ({ progress, index }))
          .filter((b) => b.progress < 100);

        if (nonFull.length === 0) {
          return currProgression;
        }

        const toFill = nonFull.slice(0, CONCURRENCY_LIMIT);

        const newProgression = currProgression.slice();
        toFill.forEach(({ index }) => {
          newProgression[index] = Math.min(100, newProgression[index] + 0.5);
        });

        return newProgression;
      });
    }, 10);

    setTimer(interval);
  }

  function stop() {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }

  const isPaused = !timer;
  const completed = progression.filter((b) => b === 100).length;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button onClick={() => setProgression((b) => b.concat(0))}>Add</button>
        <button onClick={isPaused ? start : stop}>
          {isPaused ? "Resume" : "Pause"}
        </button>
        <div className="info-label">
          Completed: {completed} / {progression.length}
        </div>
        <div className="info-label">Max bars at once: {CONCURRENCY_LIMIT}</div>
      </div>
      <div className="flex flex-col gap-2">
        {progression.map((progress, i) => (
          <ProgressBar key={i} progress={progress} />
        ))}
      </div>
    </div>
  );
}
