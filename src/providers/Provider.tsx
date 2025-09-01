"use client";
import { Children } from "@/types";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3600000, // 1 hour,
    },
  },
});

const Provider = ({ children }: Children) => {
  return (
    <>
      <Suspense>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster position="top-center" />
        </QueryClientProvider>
      </Suspense>
    </>
  );
};

export default Provider;
