import { VirtualTable } from "../../../components/virtualized-data-table"
import { memo, useMemo } from "react"
import { type NormalizedUser } from "../../../utils/normalize-users"
import type { User } from "../../../data/types"
import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@mantine/core"

interface UserTableProps {
    data: NormalizedUser
    isLoading: boolean
    onSelectUser: (userId: string) => void
}

function heavyComputation(user: User) {
    let sum = 0
    const str = user.name + user.email
    for (let i = 0; i < str.length; i++) {
        sum += str.charCodeAt(i) ** 3
    }
    return sum % 1000
}

const ScoreCell = memo(({ user }: { user: User }) => {
    const score = useMemo(() => heavyComputation(user), [user])
    return <span>{score}</span>
})

export function UserTable({ data, isLoading, onSelectUser }: UserTableProps) {

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
            header: 'Score',
            cell: ({ row }) => <ScoreCell user={row.original} />,
        },
        {
            header: 'Age',
            accessorKey: 'age',
        },
        {
            header: 'Country',
            accessorKey: 'country',
        },
        {
            header: 'Actions',
            cell: ({ row }) => (
                <Button size="xs" onClick={() => onSelectUser(row.original.id)}>Update</Button>
            ),
        },
    ], [onSelectUser])

    const tableData = useMemo(() => data.userIds.map((id) => data.users[id]), [data])

    return (
        <VirtualTable data={tableData} columns={columns} isLoading={isLoading} />
    )
}
