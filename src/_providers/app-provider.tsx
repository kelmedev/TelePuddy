"use client";

import theme from "@/theme";

import { useState } from "react";

import { AppProviderProps } from "@/types/providers";
import { ThemeProvider } from "@mui/material/styles";

import { QueryClient, QueryClientProvider } from "react-query";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
      <QueryClientProvider client={queryClient}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </AppRouterCacheProvider>
      </QueryClientProvider>
  );
};
