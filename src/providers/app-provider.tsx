"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

type TAppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: TAppProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster />
      {children}
    </ThemeProvider>
  );
};
