Remove vite App.

Add mui to the project, use styled-engine +styled-components

On top of the page should be controls panel containing:
- users count to be fetched
- "Fetch" button to run api request, that will fetch Users data from server /users endpoint.


Implement mui table and mui data grid side to side for comparison, 

Also find top 10 open source table data visualization projects
and implement separate pages under links /1, /2, etc

all tables should at minimum have paging and sorting,
if given table have some interesting/elewated features also implement them


Table should have columns corresponding to all fields from shared/UserModel.ts
Table should include pagination aligned with /users endpoint


Do not use any fetching library, use native fetch
Add `react-router`

Setup vite server proxy to allow requests from fastify server
