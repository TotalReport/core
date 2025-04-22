import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { tsr } from "../lib/react-query";

const queryClient = new QueryClient();

export function RestAPIProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <tsr.ReactQueryProvider>{children}</tsr.ReactQueryProvider>
    </QueryClientProvider>
  );
}
