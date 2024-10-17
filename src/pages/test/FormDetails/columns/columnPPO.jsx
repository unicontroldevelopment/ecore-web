"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";

export const columnsDataPPO = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sendBy",
    header: ({ column }) => {
      return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nome
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("sendBy");
      return <div className="ml-4 font-medium">{name}</div>;
    },
  },
  {
    accessorKey: "avaliatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mês
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const name = row.getValue("avaliatedAt");
        return <div className="ml-4 font-medium">{name}</div>;
      },
  },
  {
    accessorKey: "valueNote",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
        const name = row.getValue("valueNote");
        return <div className="ml-4 font-medium">{name}</div>;
      },
  },
];
