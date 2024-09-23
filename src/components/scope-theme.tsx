import { Header } from "./ui/header";

interface ScopeThemeProps {
  children: React.ReactNode;
}

export function ScopeTheme({ children }: ScopeThemeProps) {
  return (
    <>
      <Header />
      <main className="pr-2 pl-2 md:pr-0 md:pl-0 md:pt-0 w-full">
        {children}
      </main>
    </>
  );
}
