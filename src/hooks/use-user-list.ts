import { useEffect, useState } from "react";
import UserWorker from '../data/user.worker?worker'
import type { User } from "../data/types";
import { normalizeUsers, type NormalizedUser } from "../utils/normalize-users";
import { useDidUpdate } from "@mantine/hooks";

const userWorker = new UserWorker()

interface UseUserListProps {
    searchQuery?: string
    filter?: Record<string, unknown>
}

export function useUserList({ searchQuery, filter }: UseUserListProps) {
    const [data, setData] = useState<NormalizedUser>({
        userIds: [],
        users: {},
    })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const handleMessage = (event: MessageEvent<User[]>) => {
            const users: User[] = event.data
            setData(normalizeUsers(users))
            setIsLoading(false)
        }

        userWorker.addEventListener('message', handleMessage)

        userWorker.postMessage({ type: 'initialize' })

        return () => {
            userWorker.removeEventListener('message', handleMessage)
        }
    }, [])

    useDidUpdate(() => {
        userWorker.postMessage({ type: 'filter', query: searchQuery, filter })
    }, [searchQuery, filter])


    return {
        data,
        isLoading,
    }
}
