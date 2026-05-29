'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { Button } from './button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from './table';

// ── Column definition ───────────────────────────────────────

export interface Column<T> {
  /** Column header text. */
  header: string;
  /** Accessor key or function to get the cell value. */
  accessor: keyof T | ((row: T) => ReactNode);
  /** Whether the column is sortable. */
  sortable?: boolean;
  /** Cell className override. */
  className?: string;
  /** Header className override. */
  headerClassName?: string;
  /** Hide this column on mobile. */
  hideOnMobile?: boolean;
}

// ── Props ───────────────────────────────────────────────────

export interface DataTableProps<T> {
  /** Data rows. */
  data: T[];
  /** Column definitions. */
  columns: Column<T>[];
  /** Unique key accessor. */
  keyExtractor: (row: T) => string;
  /** Items per page. */
  pageSize?: number;
  /** Show loading skeleton. */
  loading?: boolean;
  /** Message when empty. */
  emptyMessage?: string;
  /** Callback when a row is clicked. */
  onRowClick?: (row: T) => void;
  /** Additional wrapper className. */
  className?: string;
  /** Row-specific className. */
  rowClassName?: (row: T) => string | undefined;
}

// ── Component ───────────────────────────────────────────────

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  className,
  rowClassName,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);

  // Sorting
  const sortedData = useMemo(() => {
    if (sortColumn === null) return data;

    const col = columns[sortColumn];
    if (!col) return data;

    return [...data].sort((a, b) => {
      const aVal = typeof col.accessor === 'function' ? col.accessor(a) : a[col.accessor];
      const bVal = typeof col.accessor === 'function' ? col.accessor(b) : b[col.accessor];

      // Compare as strings, numbers, or dates
      const aStr = String(aVal ?? '');
      const bStr = String(bVal ?? '');

      const cmp = aStr.localeCompare(bStr, 'es', { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [data, columns, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = sortedData.slice(page * pageSize, (page + 1) * pageSize);

  // Sort handler
  const handleSort = (colIndex: number) => {
    if (sortColumn === colIndex) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(colIndex);
      setSortDirection('asc');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <tr>
              {columns.map((col, i) => (
                <TableHead
                  key={i}
                  sortable={col.sortable}
                  sorted={sortColumn === i ? sortDirection : false}
                  onSort={() => handleSort(i)}
                  className={cn(
                    col.hideOnMobile && 'hidden md:table-cell',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </tr>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((_, j) => (
                    <TableCell key={j} className={cn(columns[j]?.hideOnMobile && 'hidden md:table-cell')}>
                      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={keyExtractor(row)}
                  className={cn(
                    onRowClick && 'cursor-pointer',
                    rowClassName?.(row),
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col, i) => (
                    <TableCell
                      key={i}
                      className={cn(
                        col.hideOnMobile && 'hidden md:table-cell',
                        col.className,
                      )}
                    >
                      {typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : String(row[col.accessor] ?? '')}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(0)}
              disabled={page === 0}
              aria-label="Primera página"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              aria-label="Página siguiente"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => setPage(totalPages - 1)}
              disabled={page >= totalPages - 1}
              aria-label="Última página"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
