import { readdirSync } from "fs";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pages = readdirSync("./app/exercises", {
    withFileTypes: true,
  })
    .filter((file) => file.isDirectory())
    .map((file) => {
      return file.name;
    });

  return (
    <>
      <nav className="px-2">
        <ul className="flex gap-2 flex-wrap">
          {pages.map((page) => {
            const readable = page.replace(/-/g, " ");

            return (
              <li key={page} className="underline capitalize">
                <Link href={`/exercises/${page}`}>{readable}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <main className="p-2 pt-8">{children}</main>
    </>
  );
}
