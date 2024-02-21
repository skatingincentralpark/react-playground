"use client";

import { useRef, useState } from "react";
import "./styles.css";

function pad(num: number) {
  return ("0" + num).slice(-2);
}

export default function Page() {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const lastTickTime = useRef<number>(0);

  function start() {
    lastTickTime.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTickTime.current;
      setTimeElapsed((t) => t + delta);
      lastTickTime.current = now;
    }, 1);

    setTimer(interval);
  }

  function pause() {
    timer && clearInterval(timer);
    setTimer(null);
  }

  function reset() {
    timer && clearInterval(timer);
    setTimer(null);
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
