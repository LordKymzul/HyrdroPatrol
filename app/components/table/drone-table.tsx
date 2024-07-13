"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { TDrone } from "@/app/lib/types"
import { deleteDrone } from "@/app/action/drone-action"
import { deleteObject, ref } from "firebase/storage"
import { storage } from "@/app/lib/config/firebase"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


async function deleteFileStorage(drone: TDrone) {
    try {
        const deleteRef = ref(storage, `images/${drone.droneAvatar?.avatarURLName}`);
        await deleteObject(deleteRef);
        await handleClientDeleteDrone(drone.droneID);
    } catch (e: any) {
        console.log(e);
    }
}


async function handleClientDeleteDrone(droneID: string) {
    const resultDrone = await deleteDrone(droneID);
    if (resultDrone.status < 210) {
        toast.success(resultDrone.value);
    } else {
        toast.error(resultDrone.value);
    }
}

export const columns: ColumnDef<TDrone>[] = [
    {
        accessorKey: "avatarURL",
        accessorFn: (row) => row.droneAvatar?.avatarURL,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Profile
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <Avatar>
            <AvatarImage src={row.getValue("avatarURL")} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>,
    },
    {
        accessorKey: "droneName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div >{row.getValue("droneName")}</div>,
    },
    {
        accessorKey: "droneTag",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div >{row.getValue("droneTag")}</div>,
    },

    {
        accessorKey: "locationName",
        accessorFn: (row) => row.droneLocation?.locationName,
        header: ({ column }) => {
            return <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Location
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        },
        cell: ({ row }) => {
            //  const resultDate: Date = row.getValue("companyLatestYear");
            // const formattedDate = resultDate.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
            return <div >
                {
                    row.getValue("locationName")
                }
            </div>
        }
    },
    {
        accessorKey: "droneStatus",
        header: "Status",
        cell: ({ row }) => {
            const isFly: boolean = row.getValue("droneStatus");
            const value = isFly ? 'Online' : 'Offline';
            return <div className={cn(
                "text-medium font-semibold",
                isFly ? "text-green-500" : "text-red-500"
            )}>{value}</div>
        }
        ,
    },


    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const drone = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{drone.droneName}</DropdownMenuLabel>
                        <DropdownMenuItem
                            asChild
                        >
                            <Link href={`/dashboard/drone/${drone.droneID}`}>View Drone</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => deleteFileStorage(drone)} >
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function DroneTable({ data }: {
    data: TDrone[]
}) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Search Drone names..."
                    value={(table.getColumn("droneName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("droneName")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
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
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
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
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
