import type { Metadata } from "next";
import "./globals.css";
import { readdirSync } from "fs";
import Link from "next/link";
import Navigation from "../components/navigation";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pages = readdirSync("./app", {
    withFileTypes: true,
  })
    .filter((file) => file.isDirectory())
    .map((file) => {
      return file.name;
    });

  return (
    <html lang="en">
      <body>
        <header>
          <Navigation>
            <ul className="flex gap-2">
              {pages.map((page) => {
                return (
                  <li key={page} className="border py-1 px-3 bg-white rounded">
                    <Link href={`/${page}`}>{page}</Link>
                  </li>
                );
              })}
            </ul>
          </Navigation>
        </header>
        {children}
      </body>
    </html>
  );
}
