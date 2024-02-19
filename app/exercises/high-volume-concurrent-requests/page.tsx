"use client";

import { useState } from "react";
import "./styles.css";

async function api({ index }: { index: number }) {
  return new Promise<string>((resolve, reject) => {
    const msToInvoke = Math.random() * 1000;

    console.log(`Request ${index} will take ${msToInvoke.toFixed(2)}ms`);

    setTimeout(() => {
      Math.random() >= 0.5 ? resolve(`Success`) : reject(`Fail`);
    }, msToInvoke);
  });
}

export default function Page() {
  const requestsToMake = Array(1000).fill(null);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const CONCURRENCY_LIMIT = 50;

  async function makeRequests() {
    console.log("Clicked 🐁");
    setLoading(true);

    const results: string[] = [];

    let requestsToMakeCopy: number[] = requestsToMake
      .slice()
      .map((_, i) => i + 1);

    while (requestsToMakeCopy.length > 0) {
      const currRequests = requestsToMakeCopy.splice(0, CONCURRENCY_LIMIT);

      const currResults = await Promise.allSettled(
        currRequests.map(async (val) => await api({ index: val }))
      );

      const newResults = currResults.map((result) =>
        result.status === "fulfilled" ? result.value : result.reason
      );

      results.concat(newResults);
      setResults((r) => r.concat(newResults));
    }

    setLoading(false);
    console.log("Done ⭐️");
    return results;
  }

  return (
    <div>
      <button
        className="bg-green-100 border-green-300 px-4 hover:bg-green-200 hover:border-green-400 active:bg-green-300"
        onClick={makeRequests}
      >
        Fetch
      </button>

      <div className="h-96 w-full bg-neutral-100 overflow-scroll">
        <div className="grid grid-cols-6 h-fit">
          {results.map((result, i) => (
            <div key={i}>
              <div
                className={`truncate ${
                  result === "Success" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <strong>🧪 Request {i + 1}</strong>: {result}
              </div>
            </div>
          ))}
          {loading &&
            Array(CONCURRENCY_LIMIT)
              .fill(null)
              .map((_, i) => <div key={i}>🕒 Loading...</div>)}
        </div>
      </div>
    </div>
  );
}
