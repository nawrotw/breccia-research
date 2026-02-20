import { useState } from "react";
import type { User, UsersResponse } from "@shared";
import { fetchUsers } from "@/api/fetchUsers";
import { trpcRouter } from "@/lib/trpcRouter";
import { DataTable } from "@/components/ant-users-table/DataTable";
import { columns } from "@/components/ant-users-table/columns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_PAGE_SIZE = 10;

export function AntUsersPage() {
  const [totalCount, setTotalCount] = useState<number>(50);
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
  const trpcUtils = trpcRouter.useUtils();

  const loadPage = async (
    requestedPage: number,
    requestedPageSize: number = pageSize
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchUsers({
        total: String(totalCount),
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
      const response = await trpcUtils.users.fetch({
        total: totalCount,
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
      <h2 className="text-2xl font-bold tracking-tight">
        Ant Design Users Table
        {sortTime !== null && (
          <span className="text-sm font-normal text-muted-foreground ml-4">
            Sort re-render: {sortTime.toFixed(2)} ms
          </span>
        )}
      </h2>

      <div className="flex items-center gap-4">
        <Label htmlFor="antUserCount" className="whitespace-nowrap">
          Users count:
        </Label>
        <Input
          id="antUserCount"
          type="number"
          min={0}
          value={totalCount}
          onChange={(e) => setTotalCount(Number(e.target.value) || 50)}
          className="w-32"
        />
        <Button onClick={handleFetch} disabled={loading}>
          {loading ? "Fetching..." : "Fetch"}
        </Button>
        <Button onClick={handleFetchTrpc} disabled={loading} variant="outline">
          {loading ? "Fetching..." : "Fetch tRPC"}
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          Error: {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        page={meta.page}
        pageSize={pageSize}
        totalPages={meta.totalPages}
        totalUsers={meta.totalUsers}
        loading={loading}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onSortRenderTime={setSortTime}
      />
    </div>
  );
}
