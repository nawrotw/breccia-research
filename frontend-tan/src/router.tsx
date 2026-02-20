import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TopBar } from "@/components/TopBar";
import { queryClient } from "@/lib/queryClient";
import forestBg from "@/assets/forest-bg.svg";

const rootRoute = createRootRoute({
  component: function RootLayout() {
    return (
      <ThemeProvider>
        <div
          className="min-h-screen bg-background text-foreground"
          style={{
            backgroundImage: `url(${forestBg})`,
            backgroundRepeat: "repeat",
            backgroundSize: "800px 800px",
          }}
        >
          <TopBar />
          <Outlet />
        </div>
      </ThemeProvider>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("@/pages/UsersPage"), "UsersPage"),
});

const createUserRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/create-user",
  component: lazyRouteComponent(
    () => import("@/pages/CreateUserPage"),
    "CreateUserPage"
  ),
  loader: async () => {
    const { createUserQuery } = await import("@/api/usersQueries");
    await queryClient.ensureQueryData(createUserQuery);
    /*
    The loader pre-fetches into the cache on navigation;
    The component picks up cached data via useQuery and still gets:
    - background refetching
    - error/loading states, and
    - cache invalidation.
    for free.
    */
    return {};
  },
});

const antUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ant-users",
  component: lazyRouteComponent(
    () => import("@/pages/AntUsersPage"),
    "AntUsersPage"
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  createUserRoute,
  antUsersRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
