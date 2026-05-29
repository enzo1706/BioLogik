/**
 * @biologik/ui — Shared UI component library for BioLogik.
 *
 * Design system built with Tailwind, class-variance-authority,
 * and shadcn/ui conventions.
 */

// ── Utilities ───────────────────────────────────────────────
export { cn } from './lib/cn';

// ── Components ──────────────────────────────────────────────

// Button
export { Button, buttonVariants } from './components/button';
export type { ButtonProps } from './components/button';

// Input
export { Input } from './components/input';
export type { InputProps } from './components/input';

// Textarea
export { Textarea } from './components/textarea';
export type { TextareaProps } from './components/textarea';

// Select
export { Select } from './components/select';
export type { SelectProps } from './components/select';

// FormField
export { FormField } from './components/form-field';
export type { FormFieldProps } from './components/form-field';

// SearchInput
export { SearchInput } from './components/search-input';
export type { SearchInputProps } from './components/search-input';

// Badge
export { Badge, badgeVariants } from './components/badge';
export type { BadgeProps } from './components/badge';

// Card
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/card';

// Modal
export { Modal, ConfirmDialog } from './components/modal';
export type { ModalProps, ConfirmDialogProps } from './components/modal';

// Dialog
export { Dialog, AlertDialog } from './components/dialog';
export type { DialogProps, AlertDialogProps } from './components/dialog';

// Table
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table';

// DataTable
export { DataTable } from './components/data-table';
export type { DataTableProps, Column } from './components/data-table';

// EmptyState
export { EmptyState } from './components/empty-state';
export type { EmptyStateProps } from './components/empty-state';

// LoadingState
export { LoadingState, Skeleton, CardSkeleton, TableSkeleton, StatSkeleton } from './components/loading-state';
export type { LoadingStateProps, SkeletonProps } from './components/loading-state';

// PageHeader
export { PageHeader, SectionHeader } from './components/page-header';
export type { PageHeaderProps, SectionHeaderProps } from './components/page-header';

// DashboardCard & StatCard
export { DashboardCard, StatCard } from './components/dashboard-card';
export type { DashboardCardProps, StatCardProps } from './components/dashboard-card';

// Sidebar
export { Sidebar } from './components/sidebar';
export type { SidebarProps, SidebarItem } from './components/sidebar';

// BottomNavigation
export { BottomNavigation } from './components/bottom-navigation';
export type { BottomNavigationProps, BottomNavItem } from './components/bottom-navigation';

// Tabs
export { Tabs } from './components/tabs';
export type { TabsProps } from './components/tabs';

// Accordion
export { Accordion } from './components/accordion';
export type { AccordionProps, AccordionItem } from './components/accordion';
