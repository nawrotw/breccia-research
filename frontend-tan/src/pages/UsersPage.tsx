import { useState, useMemo } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import type { SortingState, OnChangeFn } from "@tanstack/react-table";
import type { User } from "@shared";
import { fetchUsers } from "@/api/fetchUsers";
import { trpcRouter } from "@/lib/trpcRouter";
import { DataTable } from "@/components/users-table/DataTable";
import { columns } from "@/components/users-table/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_PAGE_SIZE = 10;

function serializeSorting(sorting: SortingState): string {
  if (sorting.length === 0) return "";
  return `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`;
}

function parseSorting(value: string | undefined): SortingState {
  if (!value) return [];
  const [id, dir] = value.split(":");
  if (!id) return [];
  return [{ id, desc: dir === "desc" }];
}

export function UsersPage() {
  const { page, rowsPerPage: pageSize, sort: sortParam } = useSearch({
    from: "/",
  });
  const navigate = useNavigate({ from: "/" });
  const sorting = useMemo(() => parseSorting(sortParam), [sortParam]);

  const [totalCount, setTotalCount] = useState("50");
  const [data, setData] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortTime, setSortTime] = useState<number | null>(null);
  const trpc = trpcRouter.useUtils();

  const updateParams = (
    updates: { page?: number; rowsPerPage?: number; sort?: string },
  ) => {
    navigate({
      search: (prev) => ({ ...prev, ...updates }),
      replace: true,
    });
  };

  const loadPage = async (
    requestedPage: number,
    requestedPageSize: number,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers({
        total: totalCount,
        page: String(requestedPage),
        pageSize: String(requestedPageSize),
      });
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    updateParams({ page: 1 });
    loadPage(1, pageSize);
  };

  const handleFetchTrpc = async () => {
    setLoading(true);
    setError(null);
    updateParams({ page: 1 });
    try {
      const response = await trpc.users.fetch({
        total: Number(totalCount) || 10,
        page: 1,
        pageSize,
      });
      setData(response.data);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage });
    loadPage(newPage, pageSize);
  };

  const handlePageSizeChange = (newSize: number) => {
    updateParams({ page: 1, rowsPerPage: newSize });
    loadPage(1, newSize);
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const newSorting =
      typeof updater === "function" ? updater(sorting) : updater;
    updateParams({ sort: serializeSorting(newSorting) || undefined });
  };

  return (
    <div className="container mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">
        Users Table
        {sortTime !== null && (
          <span className="ml-4 text-base font-normal text-muted-foreground">
            Sort re-render: {sortTime.toFixed(2)} ms
          </span>
        )}
      </h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="userCount" className="text-sm font-medium whitespace-nowrap">
            Users count:
          </label>
          <Input
            id="userCount"
            type="number"
            min={0}
            value={totalCount}
            onChange={(e) => setTotalCount(e.target.value)}
            className="w-32"
          />
        </div>
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </Button>
        <Button onClick={handleFetchTrpc} disabled={loading} variant="outline">
          {loading ? "Fetching..." : "Fetch tRPC"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive">Error: {error}</p>
      )}

      <DataTable
        columns={columns}
        data={data}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
        totalUsers={totalUsers}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortRenderTime={setSortTime}
        sorting={sorting}
        onSortingChange={handleSortingChange}
      />
    </div>
  );
}
