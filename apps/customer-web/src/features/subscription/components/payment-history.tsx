'use client';

import { Badge, DataTable } from '@biologik/ui';
import type { Column } from '@biologik/ui';
import type { PaymentRecord } from '../types';

// ── Status badge variant mapper ──────────────────────────────

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'destructive' | 'outline'> = {
  paid: 'success',
  pending: 'warning',
  failed: 'destructive',
  refunded: 'outline',
};

const STATUS_LABEL: Record<string, string> = {
  paid: 'Pagado',
  pending: 'Pendiente',
  failed: 'Fallido',
  refunded: 'Reembolsado',
};

// ── Currency formatter ───────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
});

// ── Columns ──────────────────────────────────────────────────

const COLUMNS: Column<PaymentRecord>[] = [
  {
    header: 'Fecha',
    accessor: (row) =>
      new Date(row.date + 'T00:00:00').toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    sortable: true,
  },
  {
    header: 'Descripción',
    accessor: 'description',
    hideOnMobile: true,
  },
  {
    header: 'Monto',
    accessor: (row) => currencyFormatter.format(row.amount),
    sortable: true,
    className: 'text-right font-medium tabular-nums',
    headerClassName: 'text-right',
  },
  {
    header: 'Estado',
    accessor: (row) => (
      <Badge variant={STATUS_VARIANT[row.status] ?? 'outline'}>
        {STATUS_LABEL[row.status] ?? row.status}
      </Badge>
    ),
    className: 'text-right',
    headerClassName: 'text-right',
  },
];

// ── Props ────────────────────────────────────────────────────

interface PaymentHistoryProps {
  payments: PaymentRecord[];
  loading?: boolean;
}

// ── Component ────────────────────────────────────────────────

/**
 * Paginated, sortable payment history table.
 * Uses the shared DataTable component from @biologik/ui.
 */
export function PaymentHistory({ payments, loading = false }: PaymentHistoryProps) {
  if (!loading && payments.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Historial de Pagos
      </h3>
      <DataTable
        data={payments}
        columns={COLUMNS}
        keyExtractor={(row) => row.id}
        pageSize={5}
        loading={loading}
        emptyMessage="No hay pagos registrados."
      />
    </div>
  );
}
