"use client";

import { useEffect, useState } from "react";
import "./styles.css";

function getCountMap(arr: unknown[]) {
  const m = new Map();
  for (let i = 0; i < arr.length; i++) {
    let num = m.get(arr[i]) || 0;
    m.set(arr[i], num + 1);
  }
  return m;
}

function generateSequence(start: number, end: number, numSteps: number) {
  const step = (end - start) / numSteps;
  let sequence = [];
  for (let i = 0; i <= numSteps; i++) {
    sequence.push(start + i * step);
  }
  return sequence;
}

export default function Page() {
  const [data, setData] = useState<[string, number][]>([]);
  const [loading, setLoading] = useState(true);

  async function getData() {
    const QTY = 200;
    const MIN = 0;
    const MAX = 10;

    const res = await fetch(
      `https://www.random.org/integers/?num=${QTY}&min=${MIN}&max=${MAX}&col=1&base=10&format=plain&rnd=new`
    );

    const numberString: string = await res.text();

    const map = getCountMap(numberString.split("\n").filter((v) => !!v.trim()));

    const data: [string, number][] = [...map.entries()].sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );

    return data;
  }

  useEffect(() => {
    refetch();
  }, []);

  const dataKeys = data.map((v) => Number(v[0]));
  const dataVals = data.map((v) => v[1]);

  const yAxisMax = dataVals.reduce((prev, curr) => {
    return curr > prev ? curr : prev;
  }, 0);

  function refetch() {
    setLoading(true);

    getData().then((data) => {
      setData(data);
      setLoading(false);
    });
  }

  if (loading) return <div>Fetching data...</div>;

  return (
    <div className="bar-graph-page-wrapper">
      <button
        onClick={refetch}
        className="px-4 border rounded w-fit bg-neutral-50"
      >
        Refetch
      </button>
      <div
        className="layout"
        style={{
          ["--height" as string]: "500px",
        }}
      >
        <div className="y-axis-labels">
          {generateSequence(0, yAxisMax, 3).map((value) => (
            <div key={`y-label-${value}`} className="y-axis-label">
              {Math.floor(value)}
            </div>
          ))}
        </div>

        <div className="bar-graph">
          {data.map(([a, b], i) => (
            <div
              key={a}
              className="bar"
              style={{
                ["--height" as string]: `${(b / yAxisMax) * 100}%`,
              }}
            />
          ))}
        </div>

        <div className="x-axis-labels">
          {dataKeys.map((value) => (
            <div className="x-axis-label" key={`x-label-${value}`}>
              {value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
