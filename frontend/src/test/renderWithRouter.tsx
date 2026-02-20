import { type ReactNode, useState } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { trpcRouter } from "@/lib/trpcRouter";
import { ThemeProvider } from "@/components/ThemeProvider";

function TrpcWrapper({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcRouter.createClient({
      links: [httpBatchLink({ url: "/api/trpc" })],
    })
  );

  return (
    <trpcRouter.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpcRouter.Provider>
  );
}

/**
 * Wraps children with React Router + ThemeProvider + tRPC for testing.
 * Optionally specify initial path (defaults to "/").
 */
export function renderWithRouter(
  ui: ReactNode,
  { initialPath = "/" }: { initialPath?: string } = {}
) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: ui,
      },
      {
        path: "/create-user",
        element: null,
      },
      {
        path: "/ant-users",
        element: null,
      },
    ],
    { initialEntries: [initialPath] }
  );

  return (
    <ThemeProvider>
      <TrpcWrapper>
        <RouterProvider router={router} />
      </TrpcWrapper>
    </ThemeProvider>
  );
}

/**
 * Wraps children with ThemeProvider + tRPC providers for testing.
 */
export function renderWithProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <TrpcWrapper>{children}</TrpcWrapper>
    </ThemeProvider>
  );
}
