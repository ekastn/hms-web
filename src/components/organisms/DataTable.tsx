import React, { useState } from "react";
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
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
    sortable?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: {
        label: string;
        onClick: (item: T) => void;
        icon?: React.ReactNode;
    }[];
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    actions,
    searchable = true,
    searchPlaceholder = "Search...",
    className,
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof T | null;
        direction: "asc" | "desc";
    }>({ key: null, direction: "asc" });

    // Handle search
    const filteredData = React.useMemo(() => {
        if (!searchQuery) return data;
        return data.filter((item) =>
            Object.values(item).some(
                (value) =>
                    value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [data, searchQuery]);

    // Handle sorting
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue === bValue) return 0;

            if (sortConfig.direction === "asc") {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });
    }, [filteredData, sortConfig]);

    const handleSort = (key: keyof T) => {
        setSortConfig((current) => {
            if (current.key === key) {
                return {
                    key,
                    direction: current.direction === "asc" ? "desc" : "asc",
                };
            }
            return { key, direction: "asc" };
        });
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
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.header.toString()}>
                                    {column.sortable ? (
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort(column.accessorKey)}
                                            className="flex items-center gap-1 p-0 font-medium hover:bg-transparent"
                                        >
                                            {column.header}
                                            {sortConfig.key === column.accessorKey && (
                                                <>
                                                    {sortConfig.direction === "asc" ? (
                                                        <ChevronUp className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4" />
                                                    )}
                                                </>
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
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="h-24 text-center"
                                >
                                    No results found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            sortedData.map((row) => (
                                <TableRow key={row.id.toString()}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${row.id}-${column.accessorKey.toString()}`}
                                        >
                                            {column.cell
                                                ? column.cell(row)
                                                : (row[column.accessorKey] as React.ReactNode)}
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
                                                        >
                                                            {action.icon && (
                                                                <span className="mr-2">
                                                                    {action.icon}
                                                                </span>
                                                            )}
                                                            {action.label}
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
