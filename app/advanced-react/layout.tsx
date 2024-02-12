import { readdirSync } from "fs";
import Link from "next/link";
import Navigation from "../../components/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pages = readdirSync("./app/advanced-react", {
    withFileTypes: true,
  })
    .filter((file) => file.isDirectory())
    .map((file) => {
      return file.name;
    });

  console.log(pages);

  return (
    <>
      <Navigation>
        <ul className="flex gap-2">
          {pages.map((page) => {
            return (
              <li key={page}>
                <Link href={`/advanced-react/${page}`}>{page}</Link>
              </li>
            );
          })}
        </ul>
      </Navigation>
      {children}
    </>
  );
}
