import { readdirSync } from "fs";
import Link from "next/link";
import Navigation from "../../components/navigation";

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
      <Navigation>
        <ul className="flex gap-2">
          {pages.map((page) => {
            return (
              <li key={page} className="border py-1 px-3 bg-white rounded">
                <Link href={`/exercises/${page}`}>{page}</Link>
              </li>
            );
          })}
        </ul>
      </Navigation>
      {children}
    </>
  );
}
