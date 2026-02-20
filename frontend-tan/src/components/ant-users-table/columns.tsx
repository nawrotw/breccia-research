import type { TableColumnsType } from "antd";
import type { User } from "@shared";

export const columns: TableColumnsType<User> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a.name.localeCompare(b.name),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <input
          placeholder="Filter name"
          value={selectedKeys[0] as string}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <button onClick={() => confirm()} style={{ marginRight: 8 }}>
          Search
        </button>
        <button onClick={() => { clearFilters?.(); confirm(); }}>Reset</button>
      </div>
    ),
    onFilter: (value, record) =>
      record.name.toLowerCase().includes(String(value).toLowerCase()),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => a.email.localeCompare(b.email),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <input
          placeholder="Filter email"
          value={selectedKeys[0] as string}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onKeyDown={(e) => e.key === "Enter" && confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <button onClick={() => confirm()} style={{ marginRight: 8 }}>
          Search
        </button>
        <button onClick={() => { clearFilters?.(); confirm(); }}>Reset</button>
      </div>
    ),
    onFilter: (value, record) =>
      record.email.toLowerCase().includes(String(value).toLowerCase()),
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Admin",
    dataIndex: "isAdmin",
    key: "isAdmin",
    sorter: (a, b) => Number(a.isAdmin) - Number(b.isAdmin),
    render: (value: boolean) => (value ? "Yes" : "No"),
    filters: [
      { text: "Yes", value: true },
      { text: "No", value: false },
    ],
    onFilter: (value, record) => record.isAdmin === value,
  },
];
