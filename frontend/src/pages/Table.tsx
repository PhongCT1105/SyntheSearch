"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Metadata {
  Abstract: string;
  Authors: string;
  Link: string;
  Title: string;
}

export interface ResearchPaper {
  metadata: Metadata;
  similarity: number;
}

export interface DataTableProps {
  data: ResearchPaper[];
}

export const columns: ColumnDef<ResearchPaper>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          table.getIsSomePageRowsSelected() && 'indeterminate'
        }
        onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
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
  },
  {
    accessorKey: "metadata.Title",
    header: "Title",
    cell: ({ row }) => (
      <a
        href={row.original.metadata.Link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#7DA5FC] font-bold hover:underline"
      >
        {row.original.metadata.Title}
      </a>
    ),
  },
  {
    accessorKey: "metadata.Authors",
    header: "Authors",
    cell: ({ row }) => <div className="max-h-[100px] overflow-y-auto">{row.original.metadata.Authors}</div>,
  },
  // {
  //   accessorKey: "metadata.Abstract",
  //   header: "Abstract",
  //   cell: ({ row }) => (
  //     <div className="max-h-[100px] overflow-y-auto">
  //       {row.original.metadata.Abstract}
  //     </div>
  //   ),
  // },
  {
    accessorKey: "similarity",
    header: "",
    cell: () => (
        <div className="text-right">
          <Button variant="outline">View Summary</Button>
        </div>
    ),
  },
]

export function ResearchDataTable({ data }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4">
        <div className="text-sm text-muted-foreground flex justify-between items-center">
          <span>
            {Object.keys(rowSelection).length} of {data.length} row(s) selected.
          </span>
          <Button className={Object.keys(rowSelection).length > 0 ? '' : 'invisible'}>
            Synthesize
          </Button>

        </div>
      </div>
    </div>
  )
}