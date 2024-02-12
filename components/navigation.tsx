export default function Navigation({
  children,
}: {
  children: React.ReactNode;
}) {
  return <nav className="bg-orange-400 px-2 py-1">{children}</nav>;
}
