import { createBrowserRouter, Outlet } from "react-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopBar } from "@/components/TopBar";
import { queryClient } from "@/lib/queryClient";
import forestBg from "@/assets/forest-bg.svg";

function RootLayout() {
  return (
    <ThemeProvider>
      <div
        className="min-h-screen bg-background text-foreground"
        style={{
          backgroundImage: `url(${forestBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <TopBar />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      {
        index: true,
        lazy: async () => {
          const { UsersPage } = await import("@/pages/UsersPage");
          return { Component: UsersPage };
        },
      },
      {
        path: "create-user",
        lazy: async () => {
          const { CreateUserPage } = await import("@/pages/CreateUserPage");
          const { createUserQuery } = await import("@/api/usersQueries");
          return {
            Component: CreateUserPage,
            loader: () => queryClient.ensureQueryData(createUserQuery),
            /*
            The loader pre-fetches into the cache on navigation; 
            The component picks up cached data via useQuery and still gets: 
            - background refetching
            - error/loading states, and
            - cache invalidation.
            for free.
            */
          };
        },
      },
      {
        path: "ant-users",
        lazy: async () => {
          const { AntUsersPage } = await import("@/pages/AntUsersPage");
          return { Component: AntUsersPage };
        },
      },
    ],
  },
]);
