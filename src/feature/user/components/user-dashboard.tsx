import { Container, Group, Loader, Modal, Stack, Text, Title } from '@mantine/core'
import { UserTable } from './user-table'
import { UserFilter } from './user-filter'
import { useCallback, useState } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { useUserList } from '@/hooks/use-user'
import type { User } from '@/data/types'
import { UserUpdateModal } from './user-update-modal'
import { delay } from '@/utils/delay'

export function UserDashboard() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
    const [isUpdatingUser, setIsUpdatingUser] = useState(false)
    const [updateUserError, setUpdateUserError] = useState<string | null>(null)
    const [filter, setFilter] = useState<Record<string, unknown>>({})
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500)
    const { data, isLoading, updateUser } = useUserList({
        searchQuery: debouncedSearchQuery,
        filter
    })

    const handleUpdateUser = useCallback(async (values: Partial<User>) => {
        setIsUpdatingUser(true)
        setUpdateUserError(null)
        setIsUpdateModalOpen(false)
        const oldUser = { ...data.users[selectedUserId ?? ''] }
        try {
            const newUser = { ...oldUser, ...values }
            updateUser(selectedUserId ?? '', newUser)
            await delay(1500)
            if (Math.random() > 0.3) {
                throw new Error(`Failed to update user with id ${selectedUserId}`)
            }
        } catch (error: unknown) {
            console.log("error")
            if (error instanceof Error) {
                setUpdateUserError(error.message)
            }
            updateUser(selectedUserId ?? '', oldUser)
        } finally {
            setIsUpdatingUser(false)
        }
    }, [updateUser, selectedUserId, data.users])

    const handleCloseUpdateModal = useCallback(() => {
        setIsUpdateModalOpen(false)
    }, [])

    const handleSelectUser = useCallback((userId: string) => {
        setSelectedUserId(userId)
        setIsUpdateModalOpen(true)
    }, [])

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
                {
                    isUpdatingUser && (
                        <Group gap="xs">
                            <Loader size="xs" />
                            <Text size='sm' c="dimmed">Updating user with id {selectedUserId}...</Text>
                        </Group>
                    )
                }
                {
                    updateUserError && (
                        <Text c="red" size='sm'>{updateUserError}</Text>
                    )
                }
                <UserTable data={data} isLoading={isLoading} onSelectUser={handleSelectUser} />
            </Stack>

            <Modal title="Update User" opened={isUpdateModalOpen} onClose={handleCloseUpdateModal}>
                {
                    selectedUserId && (
                        <UserUpdateModal
                            user={data.users[selectedUserId]}
                            onClose={handleCloseUpdateModal}
                            onUpdate={handleUpdateUser} />
                    )
                }
            </Modal>
        </Container>
    )
}
