import { useEffect, useRef, useState } from "react";
import Table from "antd/es/table";
import Select from "antd/es/select";
import type { TableColumnsType, TablePaginationConfig } from "antd";
import type { SorterResult, FilterValue } from "antd/es/table/interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PAGE_SIZE_OPTIONS = ["10", "20", "50", "100", "500", "1000"];

type WithKey<T> = T & { key: number };

interface DataTableProps<TData extends object> {
  columns: TableColumnsType<TData>;
  data: TData[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalUsers: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortRenderTime?: (ms: number) => void;
}

export function DataTable<TData extends object>({
  columns,
  data,
  page,
  pageSize,
  totalUsers,
  loading,
  onPageChange,
  onPageSizeChange,
  onSortRenderTime,
}: DataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState<boolean | undefined>(undefined);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const sortStartTime = useRef<number | null>(null);

  const filteredData = data
    .filter((row) => {
      if (adminFilter !== undefined) {
        return (row as Record<string, unknown>)["isAdmin"] === adminFilter;
      }
      return true;
    })
    .filter((row) => {
      if (!globalFilter) return true;
      return Object.values(row).some((val) =>
        String(val).toLowerCase().includes(globalFilter.toLowerCase())
      );
    });

  const dataWithKeys: WithKey<TData>[] = filteredData.map((item, index) => ({
    ...item,
    key: index,
  }));

  useEffect(() => {
    if (sortStartTime.current === null) return;
    const start = sortStartTime.current;
    requestAnimationFrame(() => {
      const elapsed = performance.now() - start;
      onSortRenderTime?.(elapsed);
      sortStartTime.current = null;
    });
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<WithKey<TData>> | SorterResult<WithKey<TData>>[]
  ) => {
    // Track sort render time
    if (sorter && !Array.isArray(sorter) && sorter.order !== undefined) {
      sortStartTime.current = performance.now();
    }

    // Handle pagination
    if (pagination.current && pagination.current !== page) {
      onPageChange(pagination.current);
    }
    if (pagination.pageSize && pagination.pageSize !== pageSize) {
      onPageSizeChange(pagination.pageSize);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Input
          placeholder="Filter all columns..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-75"
        />
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Label>isAdmin</Label>
          <Select
            allowClear
            placeholder="All"
            value={adminFilter}
            onChange={(value) => setAdminFilter(value)}
            style={{ width: 120 }}
            options={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
          />
        </div>
        {selectedRowKeys.length > 0 && (
          <span style={{ fontSize: 14, color: "#888" }}>
            {selectedRowKeys.length} of {dataWithKeys.length} row(s) selected
          </span>
        )}
      </div>

      <Table<WithKey<TData>>
        columns={columns as TableColumnsType<WithKey<TData>>}
        dataSource={dataWithKeys}
        loading={loading}
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        pagination={{
          current: page,
          pageSize,
          total: totalUsers,
          showSizeChanger: true,
          pageSizeOptions: PAGE_SIZE_OPTIONS,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} users`,
        }}
        onChange={handleTableChange}
        size="middle"
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
