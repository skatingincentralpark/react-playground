"use client";
import { ReactNode, useEffect } from "react";
import { useNavigation } from "./NavigationContext";

const SidebarLayout = ({ children }: { children: ReactNode }) => {
  const { isNavExpanded } = useNavigation();
  return (
    <div className="left" style={{ flexBasis: isNavExpanded ? "50%" : "20%" }}>
      {children}
    </div>
  );
};

const ExpandButton = () => {
  const { isNavExpanded, toggle } = useNavigation();

  useEffect(() => {
    console.info("Button that uses Context re-renders");
  });

  return (
    <button onClick={toggle} className="border py-2 px-4 bg-gray-100 rounded">
      {isNavExpanded ? "Collapse <" : "Expand >"}
    </button>
  );
};

const Sidebar = () => {
  return (
    <SidebarLayout>
      {/* this one will control the expand/collapse */}
      <ExpandButton />

      <ul>
        <li className="flex flex-col">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Shop</a>
        </li>
      </ul>
    </SidebarLayout>
  );
};

export default Sidebar;
