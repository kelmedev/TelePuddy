import type { Metadata } from "next";

import "@/globals.css";

import { Session } from "next-auth";

import { AppProvider } from "@/providers/app-provider";

export const metadata: Metadata = {
  title: "TelePuddy",
  description: "Telemedicina veterinaria.",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: Session | null;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
