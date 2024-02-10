"use client";

import { useContext } from "react";
import { LevelContext } from "./level-context";

export default function Heading({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string;
}) {
  const level = useContext(LevelContext);

  switch (level) {
    case 1:
      return <h1 className="text-4xl">h1: {children}</h1>;
    case 2:
      return <h2 className="text-3xl">h2: {children}</h2>;
    case 3:
      return <h3 className="text-2xl">h3: {children}</h3>;
    case 4:
      return <h4 className="text-xl">h4: {children}</h4>;
    case 5:
      return <h5 className="text-lg">h5: {children}</h5>;
    case 6:
      return <h6 className="text-base">h6: {children}</h6>;
    default:
      throw Error("Unknown level: " + level);
  }
}
