# React Router vs TanStack Router — Detailed Comparison

## Overview

| | React Router (v7) | TanStack Router (v1) |
|---|---|---|
| **Author** | Remix / Shopify | Tanner Linsley (TanStack) |
| **First Release** | 2014 | 2023 |
| **Maturity** | Very mature, dominant in React ecosystem | Newer but production-ready, rapidly growing |
| **Philosophy** | Convention-driven, framework-leaning (Remix merge) | Type-safe-first, library-focused |
| **Bundle Size** | ~14 kB gzipped | ~12 kB gzipped |

---

## Route Definition

### React Router (data mode)

Routes are defined as plain objects passed to `createBrowserRouter`. Components are referenced via `element` or `Component` properties:

```tsx
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <UsersPage /> },
      { path: "create-user", element: <CreateUserPage /> },
    ],
  },
]);
```

### TanStack Router

Routes are first-class objects created with `createRoute`, composed into a tree via `addChildren`. Each route explicitly declares its parent:

```tsx
import { createRouter, createRoute, createRootRoute } from "@tanstack/react-router";

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: UsersPage,
});

const routeTree = rootRoute.addChildren([indexRoute]);
const router = createRouter({ routeTree });
```

**Key Difference:** TanStack Router's route objects carry full type information. The `getParentRoute` function creates a type-level parent-child relationship, enabling inference of available params, search params, and loader data at each route level.

---

## Type Safety

### React Router

- Route params are typed as `string | undefined` by default
- Loader data typing requires manual `useLoaderData<typeof loader>()` generics
- No compile-time validation of `<Link to="...">` paths
- Search params require manual parsing (e.g., `useSearchParams()` returns `URLSearchParams`)

### TanStack Router

- **Fully inferred route params** — typo in a param name is a compile error
- **Type-safe `<Link to="...">`** — only valid registered paths are accepted
- **Type-safe search params** with schema validation (Zod integration):
  ```tsx
  const route = createRoute({
    path: "/users",
    validateSearch: z.object({ page: z.number().default(1) }),
  });
  // In component: useSearch({ from: "/users" }) returns { page: number }
  ```
- **Type-safe loader data** — automatically inferred from the `loader` return type
- **Module declaration merging** for global type registration:
  ```tsx
  declare module "@tanstack/react-router" {
    interface Register {
      router: typeof router;
    }
  }
  ```

**Verdict:** TanStack Router has significantly stronger type safety. This is its primary differentiator.<br/>

---

## Data Loading

### React Router

Loaders are defined per-route and receive `{ params, request }`. Data is accessed via `useLoaderData()`:

```tsx
{
  path: "users/:id",
  loader: async ({ params }) => {
    return fetch(`/api/users/${params.id}`);
  },
  Component: UserPage,
}

// In component:
const data = useLoaderData<typeof loader>();
```

- Supports `defer()` for streaming/suspense patterns
- Actions for mutations (`action` property + `useActionData`)
- `shouldRevalidate` to control re-fetching

### TanStack Router

Loaders also run per-route but integrate more naturally with TanStack Query:

```tsx
const route = createRoute({
  path: "/users/$id",
  loader: async ({ params, context }) => {
    await context.queryClient.ensureQueryData(userQuery(params.id));
  },
  component: UserPage,
});

// In component — data comes from useQuery, not from the loader directly
const { data } = useQuery(userQuery(params.id));
```

- `beforeLoad` hook for auth guards, redirects, context injection
- Built-in `context` system for dependency injection (e.g., passing `queryClient`)
- `staleTime` on routes — controls when loaders re-run
- No built-in mutation primitive (relies on TanStack Query mutations)

**Verdict:** React Router has a more self-contained loader/action model. TanStack Router is designed to complement TanStack Query rather than replace it.<br/>
**My 5 cents:** React Router loader integrates almost identically with React Query as TanStack Router. 
Plus for having the best UX I won't use that pattern but instead Data Loading Components pattern for greater control 
and easy customizable UI loading screens (e.g. skeletons)  


---

## Code Splitting & Lazy Loading

### React Router

Uses standard `lazy()` on route definitions:

```tsx
{
  path: "create-user",
  lazy: async () => {
    const { CreateUserPage } = await import("./pages/CreateUserPage");
    return { Component: CreateUserPage };
  },
}
```

The `lazy` function can return `Component`, `loader`, `action`, and other route properties — enabling full route-level code splitting.

### TanStack Router

Provides `lazyRouteComponent` for component-level splitting:

```tsx
const route = createRoute({
  path: "/create-user",
  component: lazyRouteComponent(
    () => import("./pages/CreateUserPage"),
    "CreateUserPage"
  ),
});
```

Also supports `route.lazy()` for splitting the entire route definition, and file-based routing with automatic code splitting.

**Verdict:** Both handle code splitting well. React Router's `lazy` is more flexible (splits component + loader + action together). TanStack Router separates "critical" (loader, search validation) from "non-critical" (component) route properties.

---

## Navigation & Links

### React Router

```tsx
import { NavLink, Link, useNavigate } from "react-router";

// Active link styling via render prop
<NavLink
  to="/users"
  className={({ isActive }) =>
    isActive ? "text-primary" : "text-muted"
  }
/>

// Programmatic navigation
const navigate = useNavigate();
navigate("/users");
```

### TanStack Router

```tsx
import { Link, useNavigate } from "@tanstack/react-router";

// Active link styling via activeProps
<Link
  to="/users"
  className="text-muted"
  activeProps={{ className: "text-primary" }}
  activeOptions={{ exact: true }}
/>

// Programmatic navigation — type-safe
const navigate = useNavigate();
navigate({ to: "/users" });
```

**Key Differences:**
- TanStack Router has no separate `NavLink` — `Link` handles active state via `activeProps`/`inactiveProps`
- TanStack Router's `navigate()` takes an object, not a string — enabling type-safe params/search
- TanStack Router's `<Link>` validates the `to` prop at compile time

---

## Search Params (Query String)

### React Router

```tsx
const [searchParams, setSearchParams] = useSearchParams();
const page = Number(searchParams.get("page") ?? "1");
// No validation, no types — everything is string | null
```

### TanStack Router

```tsx
// Define on the route:
validateSearch: z.object({
  page: z.number().default(1),
  filter: z.string().optional(),
}),

// In component:
const { page, filter } = useSearch({ from: "/users" });
// Fully typed: { page: number; filter: string | undefined }

// Update:
navigate({ search: { page: 2 } });
// Type error if you pass an invalid key
```

**Verdict:** TanStack Router's search param handling is vastly superior — validated, typed, and integrated into the routing system. React Router treats search params as unstructured strings.

---

## File-Based Routing

### React Router

No built-in file-based routing (this comes with Remix/React Router framework mode).

### TanStack Router

Full file-based routing with code generation:

```
src/routes/
  __root.tsx        → root layout
  index.tsx         → /
  users.tsx         → /users
  users.$id.tsx     → /users/:id
  users_.create.tsx → /users/create (layout escape)
```

Routes are auto-generated with full type safety. The CLI/plugin watches for file changes and regenerates the route tree.

**Verdict:** TanStack Router's file-based routing is a significant DX improvement for larger apps. React Router requires framework mode (Remix) for equivalent functionality.

---

## DevTools

### React Router

No official devtools (relies on browser DevTools, React DevTools).

### TanStack Router

Dedicated `@tanstack/router-devtools` package showing:
- Current route matches
- Loader states and data
- Search params
- Route cache status
- Pending navigations

---

## Migration Effort (This Project)

Only **3 files** required changes to migrate from React Router to TanStack Router:

| File | Change |
|---|---|
| `router.tsx` | `createBrowserRouter` → `createRouter` + `createRoute` + `createRootRoute` |
| `main.tsx` | Swap `RouterProvider` import |
| `TopBar.tsx` | `NavLink` → `Link` with `activeProps` |

Page components (`UsersPage`, `CreateUserPage`, `AntUsersPage`) required **zero changes** — they don't use any router hooks directly.

---

## Summary

| Feature | React Router | TanStack Router | Winner |
|---|---|---|---|
| **Type Safety** | Basic | Full end-to-end | TanStack Router |
| **Search Params** | Untyped strings | Validated + typed | TanStack Router |
| **Data Loading** | Self-contained (loader/action) | Complementary to TanStack Query | Tie (different philosophy) |
| **File-Based Routing** | Framework mode only | Built-in | TanStack Router |
| **DevTools** | None | Dedicated package | TanStack Router |
| **Ecosystem Maturity** | 10+ years, massive adoption | ~2 years, growing rapidly | React Router |
| **Learning Resources** | Extensive | Growing but smaller | React Router |
| **Mutations** | Built-in actions | Relies on external (TanStack Query) | React Router |
| **SSR/Framework** | Remix integration | TanStack Start (experimental) | React Router |
| **Migration Effort** | N/A | Minimal for this project | Tie |

### When to Choose React Router
- Existing projects already using it
- Need full framework features (Remix/SSR)
- Team familiarity is a priority
- Want self-contained loader/action patterns

### When to Choose TanStack Router
- Type safety is a priority
- Already using TanStack Query
- Complex search param requirements
- Starting a new SPA project
- Want file-based routing without a framework
