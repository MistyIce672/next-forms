import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { utils, writeFile } from "xlsx";

const TableToolbar = <Ttype,>({ table }: { table: Table<Ttype> }) => {
  const exportToExcel = (tableInstance: Table<Ttype>) => {
    const selectedRows = tableInstance.getSelectedRowModel().rows;
    const visibleColumns = tableInstance.getVisibleFlatColumns().filter(
      (column) =>
        "accessorKey" in column.columnDef ||
        "accessorFn" in column.columnDef
    );

    const dataToExport = selectedRows.map((row) => {
      const rowData: Record<string, any> = {};
      visibleColumns.forEach((column) => {
        const columnDef = column.columnDef;
        if ("accessorKey" in columnDef && columnDef.accessorKey) {
          rowData[column.id] = row.getValue(columnDef.accessorKey as string);
        } else if ("accessorFn" in columnDef && columnDef.accessorFn) {
          rowData[column.id] = columnDef.accessorFn(row.original, 0);
        } else {
          rowData[column.id] = row.getValue(column.id);
        }
      });
      return rowData;
    });
    const worksheet = utils.json_to_sheet(dataToExport);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Selected Data");

    writeFile(workbook, "selected_rows.xlsx");
  };
  return (
    <div className="mb-2">
      <Button onClick={() => exportToExcel(table)} variant="outline" className="mr-2">
        Export Selected to Excel
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TableToolbar;
