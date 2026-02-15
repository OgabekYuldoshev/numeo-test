import { Container, Stack, Text, Title } from '@mantine/core'
import { UserTable } from './user-table'
import { UserFilter } from './user-filter'
import { useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { useUserList } from '@/hooks/use-user-list'

export function UserDashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [filter, setFilter] = useState<Record<string, unknown>>({})
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
    const { data, isLoading } = useUserList({
        searchQuery: debouncedSearchQuery,
        filter
    })

    return (
        <Container py="md">
            <Stack gap={0}>
                <Title order={2}>
                    High Volume Users Dashboard
                </Title>
                <Text c="dimmed" size='sm'>
                    Manage and monitor 100,000+ users with advanced filtering and search capabilities
                </Text>
            </Stack>
            <Stack mt="md">
                <UserFilter
                    searchQuery={searchQuery}
                    onSearchQueryChange={setSearchQuery}
                    filter={filter}
                    onFilterChange={setFilter}
                />
                <UserTable data={data} isLoading={isLoading} />
            </Stack>
        </Container>
    )
}
