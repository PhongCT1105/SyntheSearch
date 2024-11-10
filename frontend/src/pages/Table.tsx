import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Loader } from "@/components/ui/loader";  // Spinner component
import axios from "axios";

interface Metadata {
  Abstract: string;
  Authors: string;
  Link: string;
  Title: string;
  "Full Text": string;
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
                (table.getIsSomePageRowsSelected() && 'indeterminate')
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
  {
    accessorKey: "similarity",
    header: "",
    cell: ({ row }) => <SummaryDialog fullText={row.original.metadata["Full Text"]} />,
  },
];

const SummaryDialog: React.FC<{ fullText: string }> = ({ fullText }) => {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [summaryData, setSummaryData] = React.useState<{ summary: string; suggestions: string } | null>(null);

  const fetchSummarySuggestions = async () => {
    setLoading(true);
    setSummaryData(null);
    try {
      const response = await axios.post("http://localhost:8000/generate_summary_suggestions", { full_text: fullText });
      setSummaryData(response.data);
    } catch (error) {
      console.error("Error fetching summary/suggestions:", error);
    }
    setLoading(false);
  };

  return (
      <>
        <Button variant="outline" onClick={() => { setOpen(true); fetchSummarySuggestions(); }}>
          View Summary
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Summary and Suggestions</DialogTitle>
            </DialogHeader>
            {loading ? (
                <div>HAHAHHAHA</div>
                // <Loader className="mx-auto my-4" />  // Loading spinner
            ) : summaryData ? (
                <div>
                  <h2 className="font-bold">Summary:</h2>
                  <p>{summaryData.summary}</p>
                  <h2 className="font-bold mt-4">Suggestions:</h2>
                  <p>{summaryData.suggestions}</p>
                </div>
            ) : (
                <p>Error retrieving data</p>
            )}
          </DialogContent>
        </Dialog>
      </>
  );
};

export function ResearchDataTable({ data }: DataTableProps) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
  });

  const handleSynthesize = async () => {
    const selectedRows = table.getSelectedRowModel().flatRows;
    const selectedTexts = selectedRows.map(row => row.original.metadata["Full Text"]);
    console.log(selectedTexts)
    try {
      const response = await axios.post("http://localhost:8000/generate_synthesis", {
        texts: selectedTexts,
      });
      console.log("Synthesize response:", response.data);
    } catch (error) {
      console.error("Error sending selected texts to the API:", error);
    }
  };

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
            <Button
                onClick={handleSynthesize}
                className={Object.keys(rowSelection).length > 0 ? '' : 'invisible'}
            >
              Synthesize
            </Button>
          </div>
        </div>
      </div>
  );
}
