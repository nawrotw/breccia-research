import { useState } from "react";
import type { User, UsersResponse } from "@shared";
import { fetchUsers } from "@/api/fetchUsers";
import { trpcRouter } from "@/lib/trpcRouter";
import { DataTable } from "@/components/users-table/DataTable";
import { columns } from "@/components/users-table/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_PAGE_SIZE = 10;

export function UsersPage() {
  const [totalCount, setTotalCount] = useState("50");
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<Omit<UsersResponse, "data">>({
    totalUsers: 0,
    page: 1,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortTime, setSortTime] = useState<number | null>(null);
  const trpc = trpcRouter.useUtils();

  const loadPage = async (requestedPage: number, requestedPageSize: number = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers({
        total: totalCount,
        page: String(requestedPage),
        pageSize: String(requestedPageSize),
      });
      setData(response.data);
      setMeta({
        totalUsers: response.totalUsers,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    loadPage(1);
  };

  const handleFetchTrpc = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await trpc.users.fetch({
        total: Number(totalCount) || 10,
        page: 1,
        pageSize,
      });
      setData(response.data);
      setMeta({
        totalUsers: response.totalUsers,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    loadPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    loadPage(1, newSize);
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
        page={meta.page}
        pageSize={pageSize}
        totalPages={meta.totalPages}
        totalUsers={meta.totalUsers}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortRenderTime={setSortTime}
      />
    </div>
  );
}
