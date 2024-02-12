"use client";

import React, { ReactNode, useEffect, useState } from "react";

import { NavigationController } from "./NavigationContext";
import Sidebar from "./Sidebar";
import MainPart from "./MainPart";

const Layout = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY);
    });
  }, []);

  return (
    <NavigationController>
      <div className="border p-4 flex h-screen">{children}</div>
    </NavigationController>
  );
};

const Stuff = () => {
  return (
    <Layout>
      <Sidebar />
      <MainPart />
    </Layout>
  );
};

export default function Page() {
  return (
    <main className="h-full max-h-screen">
      <h3>
        Very slow "Page" component - click on expand/collapse to toggle nav
      </h3>
      <p>Scrolling causes re-render of everything that uses Context</p>
      <Stuff />
    </main>
  );
}
