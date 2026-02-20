Remove vite App.

On top of the page create header bar with: 
- FSC logo on the left
- theme switch on the right

Create forted image (view from top) and use it as a subtle background.
 
Under top bar create controls panel containing:
- users count to be fetched
- "Fetch" button to run api request, that will fetch Users data from server /users endpoint.

Below, create table that should have columns corresponding to all fields from shared/UserModel.ts

Table should include features like:
- pagination aligned with /users endpoint:
    - page and page size picker,
- sorting (client side), icon should indicate sorting direction
- filtering (client side)
- row selection (client side)

Use libraries:
- shadcn/ui
- TanStack Table

Do not use any fetching library, use native fetch

Setup vite server proxy to allow requests from fastify server

Create new page under /create-user and implement form for creating new user.
Form should contain all fields from shared/UserModel.ts,
don't implement subtmit action.

Customize theme to use light blue as a primary color

Use libraries:
- tanstack router

Form
add resactHookForm to the project and implement form logic on CreateUserPage. 
Make all fields required.
Under the fields add Submit button which will display message:
- when success - form JSON,
- when error - JSON containing all errors




React router split code test
## Add more code
Create new page and implement table similar to UsersPage, but this time use ant.d table.
Add ant.d to the project if needed.

Refactor routing to user react-router
Here you have documentation: https://reactrouter.com
Use "data mode" to create routes.

## tRPC
Create new endpoint using tRPC. 
Here are the docs: https://trpc.io/
Endpoint should have idencitcal behaviour to /users and url: /trpc/users.
It should share as much logic sa possible.

On frontend use tRPC with TanStack React Query.
On pages with Users tables add new button next to 'Fetch' with label 'Fetch tRPC' and implement in same way as 'Fetch'

## add fetching befor page load
CreateUserPage will now require list of the users fetched from /user endpoint.
Add fetching users to the router before page is displayed, so when page is dispalyed users are already available.
Fetch first 100 users.
On the page, next to text 'Create User' add smaller text with number of fetched users
