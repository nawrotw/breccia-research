Remove vite App.

Create Table page with controls panel on top of the page containing:
- users count to be fetched
- "Fetch" button to run api request, that will fetch Users data from server /users endpoint.

Table should have columns corresponding to all fields from shared/UserModel.ts

Table should include features like:
- pagination aligned with /users endpoint
- sorting (client side)
- filtering (client side)
- row selection (client side)

Libraries:
- shadcn/ui
- TanStack Table

Do not use any fetching library, use native fetch

Setup vite server proxy to allow requests from fastify server
