import { VirtualTable } from "../../../components/virtualized-data-table"
import { useMemo } from "react"
import { type NormalizedUser } from "../../../utils/normalize-users"
import type { User } from "../../../data/types"
import type { ColumnDef } from "@tanstack/react-table"

interface UserTableProps {
    data: NormalizedUser
    isLoading: boolean
}

export function UserTable({ data, isLoading }: UserTableProps) {
    const columns = useMemo<ColumnDef<User>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Email',
            accessorKey: 'email',
        },
        {
            header: 'Age',
            accessorKey: 'age',
        },
        {
            header: 'Country',
            accessorKey: 'country',
        },
    ], [])

    const tableData = useMemo(() => data.userIds.map((id) => data.users[id]), [data])

    return (
        <VirtualTable data={tableData} columns={columns} isLoading={isLoading} />
    )
}
