import type { User } from '@/data/types'
import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

type UserUpdateModalFormValues = Partial<User>

interface UserUpdateModalProps {
    user: User
    onClose: () => void
    onUpdate: (values: UserUpdateModalFormValues) => void
}
export function UserUpdateModal({ user, onClose, onUpdate }: UserUpdateModalProps) {
    const form = useForm<UserUpdateModalFormValues>({
        initialValues: {
            ...user
        },
    })

    return (
        <form onSubmit={form.onSubmit((values) => onUpdate(values))}>
            <Stack>
                <TextInput
                    label="Name"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    label="Email"
                    {...form.getInputProps('email')}
                />
                <TextInput
                    label="Age"
                    {...form.getInputProps('age')}
                />
                <TextInput
                    label="Country"
                    {...form.getInputProps('country')}
                />
                <Group>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Update</Button>
                </Group>
            </Stack>
        </form>
    )
}
