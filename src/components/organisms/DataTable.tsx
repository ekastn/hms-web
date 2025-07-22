import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../molecules/Table";
import { SearchInput } from "../molecules/SearchInput";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface Action<T> {
    label: string | ((item: T) => string);
    onClick: (item: T) => void;
    icon?: React.ReactNode | ((item: T) => React.ReactNode);
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | any;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: Action<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    actions,
    searchable = true,
    searchPlaceholder = "Search...",
    className,
    isLoading = false,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    // Handle empty state
    const renderEmptyState = () => (
        <TableRow>
            <TableCell
                colSpan={columns.length + (actions ? 1 : 0)}
                className="h-24 text-center"
            >
                {isLoading ? (
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading...</span>
                    </div>
                ) : (
                    'No data available'
                )}
            </TableCell>
        </TableRow>
    );

    // Handle search
    const filteredData = useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((item) =>
            Object.values(item).some(
                (value) =>
                    value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery]);

    // Handle sorting
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aValue = sortConfig.key ? a[sortConfig.key] : '';
            const bValue = sortConfig.key ? b[sortConfig.key] : '';

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof T | undefined) => {
        if (!key) return;
        
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    return (
        <div className={cn("space-y-4", className)}>
            {searchable && (
                <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="max-w-sm"
                />
            )}
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.header.toString()}>
                                    {column.sortable && column.accessorKey ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(column.accessorKey as keyof T)}
                                            className="flex items-center gap-1 p-0 font-medium hover:bg-transparent"
                                        >
                                            {column.header}
                                            {sortConfig.key === column.accessorKey && (
                                                <span className="ml-1">
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </span>
                                            )}
                                        </Button>
                                    ) : (
                                        column.header
                                    )}
                                </TableHead>
                            ))}
                            {actions && <TableHead>Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedData.length === 0 ? (
                            renderEmptyState()
                        ) : (
                            sortedData.map((row) => (
                                <TableRow key={row.id.toString()}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${row.id}-${column.accessorKey?.toString() || column.header}`}
                                        >
                                            {column.cell ? (
                                                column.cell(row)
                                            ) : column.accessorKey ? (
                                                <span>{String(row[column.accessorKey])}</span>
                                            ) : null}
                                        </TableCell>
                                    ))}
                                    {actions && (
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        aria-label="Open menu"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {actions.map((action, index) => (
                                                        <DropdownMenuItem
                                                            key={index}
                                                            onClick={() => action.onClick(row)}
                                                            className={cn(
                                                                "flex items-center",
                                                                typeof action.variant === 'function'
                                                                    ? action.variant(row) === 'destructive' && "text-destructive focus:text-destructive-foreground focus:bg-destructive"
                                                                    : action.variant === 'destructive' && "text-destructive focus:text-destructive-foreground focus:bg-destructive"
                                                            )}
                                                        >
                                                            {typeof action.icon === 'function' ? action.icon(row) : action.icon && (
                                                                <span className="mr-2">
                                                                    {action.icon}
                                                                </span>
                                                            )}
                                                            {typeof action.label === 'function' ? action.label(row) : action.label}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
