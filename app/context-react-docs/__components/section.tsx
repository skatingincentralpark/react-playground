"use client";

import { useContext } from "react";
import { LevelContext } from "./level-context";

export default function Section({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const level = useContext(LevelContext);

  return (
    <section className="section border border-black p-4 m-4">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
