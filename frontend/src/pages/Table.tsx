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

function renderMarkdown(message: string) {
  // Convert headers
  if (message.startsWith("# ")) {
    return <h1 className="hidden">{message.replace("# ", "")}</h1>;
  }
  if (message.startsWith("## ")) {
    return <h2 className="text-3xl font-bold mt-8">{message.replace("## ", "")}</h2>;
  }
  if (message.startsWith("### ")) {
    return <h3 className="text-2xl font-bold mt-8">{message.replace("### ", "")}</h3>;
  }
  const orderedListItems = message.split("\n").filter(line => line.match(/^\d+\.\s/));
  if (orderedListItems.length > 1) {
    const orderedList = orderedListItems.map((line, i) => (
        <li key={i} className="ml-6 list-decimal">{line.replace(/^\d+\.\s/, "")}</li>
    ));

    return <ol>{orderedList}</ol>;
  }

  // Convert bold text
  if (message.includes("**")) {
    const boldText = message.split("**").map((segment, i) =>
        i % 2 === 1 ? (
            <span key={i} className="font-bold">{segment}</span>
        ) : (
            segment
        )
    );
    return <p>{boldText}</p>;
  }

  // Convert italic text
  if (message.includes("*") && !message.includes("**")) {
    const italicText = message.split("*").map((segment, i) =>
        i % 2 === 1 ? (
            <span key={i} className="italic">{segment}</span>
        ) : (
            segment
        )
    );
    return <p>{italicText}</p>;
  }

  // Convert list items
  if (message.startsWith("- ")) {
    return <li className="ml-4 list-disc">{message.replace("- ", "")}</li>;
  }

  // Default paragraph
  return <p>{message}</p>;
}

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
        <DialogContent className={"max-w-[800px]"}>
          <DialogHeader>
            <DialogTitle>Summary and Suggestions</DialogTitle>
          </DialogHeader>
          {loading ? (
            <div>
              <p>Generating summary, please wait...</p>
              <Progress value={progress} className="w-full my-4" />
            </div>
          ) : summaryData ? (
              <div className="max-h-[80vh] overflow-y-scroll">
                <h2 className="font-bold text-2xl mb-2">Summary</h2>
                {renderMarkdown(summaryData.summary)}
                <h2 className="font-bold mt-4 mb-2 text-2xl">Suggestions</h2>
                {renderMarkdown(summaryData.suggestions)}
              </div>

          ) : (
              <p>Error retrieving data</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export function ResearchDataTable({data}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [synthesisResult, setSynthesisResult] = useState<string[] | null>(null);
  const [isSynthesisOpen, setIsSynthesisOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

    setLoading(true);
    setProgress(0);
    setIsSynthesisOpen(true);
    setSynthesisResult(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 500);

    try {
      const response = await axios.post("http://127.0.0.1:8000/generate_synthesis", { full_texts: selectedTexts });
      const result = response.data.synthesis.split("\n");

      setSynthesisResult(result);
      setProgress(100);
    } catch (error) {
      console.error("Error sending selected texts to the API:", error);
    } finally {
      clearInterval(interval);
      setLoading(false);
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
        <Dialog open={isSynthesisOpen} onOpenChange={setIsSynthesisOpen}>
          <DialogContent className={"max-w-[800px]"}>
            <DialogHeader>
              <DialogTitle>Synthesis Result</DialogTitle>
            </DialogHeader>
            {loading ? (
                <div>
                  <p>Generating synthesis, please wait...</p>
                  <Progress value={progress} className="w-full my-4" />
                </div>
            ) : synthesisResult ? (
                <div className="space-y-3 h-[80vh] overflow-y-scroll">
                  {synthesisResult.map((message, index) => (
                      <div key={index} className="">
                        {renderMarkdown(message)}
                      </div>
                  ))}
                </div>

            ) : (
                <p>Error retrieving synthesis data</p>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
}
