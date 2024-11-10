import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { Progress } from "@/components/ui/progress";
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

interface Metadata {
  Abstract: string;
  Authors: string;
  Link: string;
  Title: string;
  "Full Text": string;
}

interface SummaryData {
  summary: string;
  suggestions: string;
}

const summaryCache: { [link: string]: SummaryData } = {};

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
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    cell: ({ row }) => (
      <div className="max-h-[100px] overflow-y-auto">{row.original.metadata.Authors}</div>
    ),
  },
  {
    accessorKey: "similarity",
    header: "",
    cell: ({ row }) => <SummaryDialog fullText={row.original.metadata["Full Text"]} />,
  },
];

const SummaryDialog: React.FC<{ fullText: string }> = ({ fullText }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);
  const [progress, setProgress] = useState(0);

  const fetchSummarySuggestions = async () => {
    setLoading(true);
    setProgress(0);
    setSummaryData(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 500);

    try {
      const response = await axios.post("http://localhost:8000/generate_summary_suggestions", { full_text: fullText });
      const data: SummaryData = response.data;
      setSummaryData(data);
      setProgress(100);
      summaryCache[fullText] = data;
    } catch (error) {
      console.error("Error fetching summary/suggestions:", error);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    if (summaryCache[fullText]) {
      setSummaryData(summaryCache[fullText]);
      setProgress(100);
      setLoading(false);
    } else {
      setSummaryData(null);
      fetchSummarySuggestions();
    }
    setOpen(true);
  };

  return (
    <>
      <Button variant="outline" onClick={handleOpenDialog}>
        View Summary
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Summary and Suggestions</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div>
              <p>Generating summary, please wait...</p>
              <Progress value={progress} className="w-full my-4" />
            </div>
          ) : summaryData ? (
            <div className="max-h-[300px] overflow-y-scroll">
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<string[] | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTableVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

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
    const selectedTexts = selectedRows.map((row) => row.original.metadata["Full Text"]);

    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_synthesis", { full_texts: selectedTexts });
      setSynthesisResult(response.data.synthesis.split("\n")); // Splitting for chat-style display
    } catch (error) {
      console.error("Error sending selected texts to the API:", error);
    }
  };

  return (
    <div className={`transition-opacity duration-700 ${isTableVisible ? "opacity-100" : "opacity-0"} w-full`}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
          <Button onClick={handleSynthesize} className={Object.keys(rowSelection).length > 0 ? "" : "invisible"}>
            Synthesize
          </Button>
        </div>
      </div>
      {synthesisResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h2 className="font-bold mb-4">Chat Synthesis:</h2>
          <div className="space-y-3">
            {synthesisResult.map((message, index) => (
              <div key={index} className={`p-2 rounded-lg ${index % 2 === 0 ? "bg-blue-100" : "bg-gray-200"}`}>
                <p>{message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
