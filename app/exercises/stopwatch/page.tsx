"use client";

import { useState } from "react";
import "./styles.css";

function pad(num: number) {
  return ("0" + num).slice(-2);
}

export default function Page() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [prevTimeElapsed, setPrevTimeElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  function start() {
    const startedAt = Date.now();

    const interval = setInterval(() => {
      const currTime = Date.now();

      setTimeElapsed(() => {
        if (prevTimeElapsed) {
          return prevTimeElapsed + (currTime - startedAt);
        }

        return currTime - startedAt;
      });
    }, 1);

    setTimer(interval);
  }

  function pause() {
    timer && clearInterval(timer);
    setTimer(null);
    setPrevTimeElapsed(timeElapsed);
  }

  function reset() {
    timer && clearInterval(timer);
    setTimer(null);
    setPrevTimeElapsed(0);
    setTimeElapsed(0);
  }

  const paused = !timer;
  const milliseconds = Math.floor((timeElapsed % 1000) / 10);
  const seconds = Math.floor((timeElapsed / 1000) % 60);
  const minutes = Math.floor((timeElapsed / 1000 / 60) % 60);
  const hours = Math.floor(timeElapsed / 1000 / 60 / 60);

  return (
    <div>
      <p>
        {pad(hours)}h {pad(minutes)}m {pad(seconds)}s {milliseconds}ms
      </p>
      <div className="flex gap-2">
        <button onClick={paused ? start : pause}>
          {paused ? "Start" : "Pause"}
        </button>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
