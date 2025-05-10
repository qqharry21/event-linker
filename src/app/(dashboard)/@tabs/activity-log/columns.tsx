"use client";

import { Types } from "@/types/global";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Types.ActivityLog>[] = [
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const action = row.original.action;
      return (
        <pre className="bg-muted inline-block rounded-md px-2 py-1 text-xs capitalize">
          {action}
        </pre>
      );
    },
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => {
      const metadata = row.original.metadata;
      return (
        <pre className="bg-muted block rounded-md px-4 py-2 text-xs">
          {JSON.stringify(metadata, null, 2)}
        </pre>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return <pre className="text-xs">{timestamp.toLocaleString()}</pre>;
    },
  },
];
