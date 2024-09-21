import { LayoutProps } from "@/types/app";

import { ToolBar } from "./toolbar";

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-white">
      <ToolBar isLinks={true} />
      <section className="flex flex-grow">
        <main className="flex-grow bg-[#f4f5ff] p-5 md:p-40 md:pt-14">
          {children}
        </main>
      </section>
    </div>
  );
}
