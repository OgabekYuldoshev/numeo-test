import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { useRef, useState } from "react"
import { Paper, Table, Text, Loader, Box } from "@mantine/core"
import { useVirtualizer } from "@tanstack/react-virtual"

interface VirtualTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  height?: string | number
  estimatedRowHeight?: number
  overscan?: number
  enableSorting?: boolean
  isLoading?: boolean
  loadingMessage?: string
  emptyStateMessage?: string
}

export function VirtualTable<T>({
  data,
  columns,
  height = 600,
  estimatedRowHeight = 45,
  overscan = 10,
  enableSorting = true,
  isLoading = false,
  loadingMessage = "Loading...",
  emptyStateMessage = "No data",
}: VirtualTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    enableSorting,
  })

  const rows = table.getRowModel().rows
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedRowHeight,
    overscan,
  })

  const virtualItems = virtualizer.getVirtualItems()

  if (isLoading) {
    return (
      <Paper withBorder style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader size="sm" />
        <Text ml="sm">{loadingMessage}</Text>
      </Paper>
    )
  }

  if (rows.length === 0) {
    return (
      <Paper withBorder style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Text>{emptyStateMessage}</Text>
      </Paper>
    )
  }

  return (
    <Paper ref={parentRef} withBorder style={{ height, overflow: "auto", position: "relative" }}>
      <Table style={{ width: "100%", tableLayout: "fixed" }}>
        <Table.Thead style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          {table.getHeaderGroups().map(hg => (
            <Table.Tr key={hg.id}>
              {hg.headers.map(header => (
                <Table.Th key={header.id} onClick={header.column.getToggleSortingHandler()} style={{ cursor: header.column.getCanSort() ? "pointer" : "default", padding: "8px" }}>
                  <Box style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      <span style={{ fontSize: 12, color: "#868e96" }}>
                        {{ asc: "↑", desc: "↓" }[header.column.getIsSorted() as string] ?? "↕"}
                      </span>
                    )}
                  </Box>
                </Table.Th>
              ))}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
          {virtualItems.map(virtualRow => {
            const row = rows[virtualRow.index]
            return (
              <Table.Tr key={row.id} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: virtualRow.size, transform: `translateY(${virtualRow.start}px)`, display: "flex" }}>
                {row.getVisibleCells().map(cell => (
                  <Table.Td key={cell.id} style={{ flex: 1, padding: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Paper>
  )
}
